defmodule HillsideJukebox.JukeboxServer do
  defstruct([:queue_pid, :timer_pid, :users_pid, :num_users, :num_skip_vote])
  use GenServer
  require Logger

  ## API

  def start_link(_, room_name) do
    Logger.debug("Starting jukebox with name #{inspect(room_name)}")

    GenServer.start_link(
      __MODULE__,
      %HillsideJukebox.JukeboxServer{
        num_skip_vote: 0
      },
      name: via_tuple(room_name)
    )
  end

  def add_to_queue(room_name, url) do
    GenServer.call(via_tuple(room_name), {:add_to_queue, url: url})
  end

  def play_next(room_name) do
    GenServer.call(via_tuple(room_name), :play_next)
  end

  def set_workers(room_name, queue_pid, timer_pid, users_pid) do
    GenServer.cast(via_tuple(room_name), {:set_workers, queue_pid, timer_pid, users_pid})
  end

  def add_user(room_name, creds = %Spotify.Credentials{}) do
    GenServer.cast(via_tuple(room_name), {:add_user, creds})
  end

  def sync_audio(room_name, user) do
    GenServer.cast(via_tuple(room_name), {:sync_audio, user})
  end

  def get_users_pid(room_name) do
    GenServer.call(via_tuple(room_name), :get_users_pid)
  end

  def get_queue_pid(room_name) do
    GenServer.call(via_tuple(room_name), :get_queue_pid)
  end

  def vote_skip(room_name, user_id) do
    GenServer.cast(via_tuple(room_name), {:vote_skip, user_id})
  end

  def current_playing(room_name) do
    GenServer.call(via_tuple(room_name), :current)
  end

  def remove_user(room_name, user_id) do
    GenServer.call(via_tuple(room_name), {:remove_user, user_id})
  end

  defp via_tuple(room_name) do
    {:via, :gproc, {:n, :l, {:jukebox_room, room_name}}}
  end

  ## Genserver impl
  ## State is a {pid, pid} tuple where the first pid is the queue process and the second the timer process

  @impl true
  def handle_call(
        :play_next,
        _from,
        server = %HillsideJukebox.JukeboxServer{
          queue_pid: queue_pid
        }
      ) do
  end

  @impl true
  def handle_call(
        {:add_to_queue, url: url},
        _from,
        server = %HillsideJukebox.JukeboxServer{
          users_pid: users_pid
        }
      ) do
    %HillsideJukebox.User{spotify_credentials: creds} = HillsideJukebox.Users.get_host(users_pid)

    song = HillsideJukebox.URLs.get_song(url, creds)

    add_internal(server, song)
    {:reply, song, server}
  end

  def handle_call(
        :get_users_pid,
        _from,
        server = %HillsideJukebox.JukeboxServer{users_pid: users_pid}
      ) do
    {:reply, users_pid, server}
  end

  def handle_call(
        :get_queue_pid,
        _from,
        server = %HillsideJukebox.JukeboxServer{queue_pid: queue_pid}
      ) do
    {:reply, queue_pid, server}
  end

  def handle_call(:current, _from, server = %HillsideJukebox.JukeboxServer{queue_pid: queue_pid}) do
    current = HillsideJukebox.SongQueue.Server.current(queue_pid)
    {:reply, current, server}
  end

  @impl true
  def handle_cast({:set_workers, queue_pid, timer_pid, users_pid}, state) do
    num_users = length(HillsideJukebox.Users.get_all(users_pid))

    {:noreply,
     %{
       state
       | timer_pid: timer_pid,
         queue_pid: queue_pid,
         users_pid: users_pid,
         num_users: num_users
     }}
  end

  def handle_cast(
        {:remove_user, user_id},
        state = %HillsideJukebox.JukeboxServer{users_pid: users_pid, num_users: num_users}
      ) do
    HillsideJukebox.Users.remove_with_user_id(users_pid, user_id)
    # Need to make sure we actually removed someone before decrementing - security hole
    {:noreply, %{state | num_users: num_users - 1}}
  end

  @impl true
  def handle_cast(
        {:sync_audio, user},
        server = %HillsideJukebox.JukeboxServer{
          timer_pid: timer_pid
        }
      ) do
    case HillsideJukebox.SongQueue.Timer.get_offset(timer_pid) do
      :not_started -> nil
      offset -> play_with_offset_for_user(user, offset, server)
    end

    {:noreply, server}
  end

  @impl true
  def handle_cast(
        {:add_user, creds},
        server = %HillsideJukebox.JukeboxServer{
          users_pid: users_pid,
          num_users: num_users
        }
      ) do
    _new_user = HillsideJukebox.Users.add_credentials(users_pid, creds)
    {:noreply, %{server | num_users: num_users + 1}}
  end

  @impl true
  def handle_cast(
        {:vote_skip, user_id},
        server = %HillsideJukebox.JukeboxServer{
          users_pid: users_pid,
          num_skip_vote: num_skip_vote,
          num_users: num_users
        }
      ) do
    state =
      %HillsideJukebox.User.State{voted_skip: has_voted?} =
      HillsideJukebox.Users.get_state(users_pid, user_id)

    new_num_skip_vote = num_skip_vote

    if(!has_voted?) do
      new_state = %HillsideJukebox.User.State{state | voted_skip: true}
      HillsideJukebox.Users.set_state(users_pid, user_id, new_state)
      new_num_skip_vote = new_num_skip_vote + 1

      if(new_num_skip_vote > num_users / 2) do
        skip_current_song(server)
      end

      {:noreply, %HillsideJukebox.JukeboxServer{server | num_skip_vote: new_num_skip_vote}}
    else
      {:noreply, server}
    end
  end

  defp play_next_internal(
         server = %HillsideJukebox.JukeboxServer{queue_pid: queue_pid, users_pid: users_pid}
       ) do
    # Why are we popping and then getting current? Really could be done in one step
    next = HillsideJukebox.SongQueue.Server.next(queue_pid)
    # Again, need a way to broadcast this only to a room code
    HjWeb.Endpoint.broadcast!("queue", "queue:pop", next)
    next_song = HillsideJukebox.SongQueue.Server.current(queue_pid)
    HillsideJukebox.Users.reset_skip_votes(users_pid)
    play_and_autoplay_next(next_song, server)
    {:reply, next_song, server}
  end

  defp skip_current_song(
         server = %HillsideJukebox.JukeboxServer{
           timer_pid: timer_pid,
           users_pid: users_pid
         }
       ) do
    HillsideJukebox.SongQueue.Timer.cancel(timer_pid)
    play_next_internal(server)
  end

  defp play_and_autoplay_next(
         song = %HillsideJukebox.Song{duration: duration},
         _server = %HillsideJukebox.JukeboxServer{
           timer_pid: timer_pid,
           users_pid: users_pid
         }
       ) do
    HillsideJukebox.Player.play(users_pid, song)
    HillsideJukebox.SongQueue.Timer.timeout(timer_pid, duration)
    song
  end

  defp play_with_offset_for_user(
         user,
         offset_ms,
         _server = %HillsideJukebox.JukeboxServer{
           queue_pid: queue_pid,
           users_pid: users_pid
         }
       ) do
    current_song = HillsideJukebox.SongQueue.Server.current(queue_pid)
    HillsideJukebox.Player.play_at_for_user(users_pid, user, current_song, offset_ms)
  end

  defp add_internal(
         server = %HillsideJukebox.JukeboxServer{
           queue_pid: queue_pid
         },
         song
       ) do
    if HillsideJukebox.SongQueue.Server.is_empty(queue_pid) do
      # If empty, play the first song as soon as it's added
      HillsideJukebox.SongQueue.Server.add(queue_pid, song)
      play_and_autoplay_next(song, server)
    else
      HillsideJukebox.SongQueue.Server.add(queue_pid, song)
    end
  end

  defp is_currently_playing({queue_pid, timer_pid, users_pid}) do
  end
end
