defmodule HillsideJukebox.JukeboxServer do
  defstruct ~w[room_code
               queue_pid
               timer_pid
               users_pid
               num_users
               skip_thresh
               num_skip_votes
               skip_log]a
  use GenServer
  require Logger
  alias HillsideJukebox.{User}

  ## API

  def start_link(_, room_name) do
    GenServer.start_link(
      __MODULE__,
      %HillsideJukebox.JukeboxServer{
        num_skip_votes: 0,
        skip_thresh: 3,
        room_code: room_name,
        skip_log: MapSet.new()
      },
      name: via_tuple(room_name)
    )
  end

  @doc """
  Adds the song, specified by Spotify track URI, to the room given by the room code
  """
  def add_to_queue(room_name, url, submitter) do
    GenServer.call(via_tuple(room_name), {:add_to_queue, url: url, submitter: submitter})
  end

  @doc """
  Plays the next song in the queue. This kicks off the entire queue to play until it is
  empty, so subsequent calls do not need to be made.
  """
  def play_next(room_name) do
    GenServer.call(via_tuple(room_name), :play_next)
  end

  @doc """
  Set the worker PIDs for the jukebox. The worker pids are the processes
  for the queue state, the timer state, and the user pool. This is
  a utility function for setting the PIDs when the supervisor
  restarts any of the processes.
  """
  def set_workers(room_name, queue_pid, timer_pid, users_pid) do
    GenServer.cast(via_tuple(room_name), {:set_workers, queue_pid, timer_pid, users_pid})
  end

  @doc """
  For the given user, sync their spotify account playback to the rest of the room. This
  will immediately transfer playback of the given user's spotify account to the currently
  playing song at the current song position.
  """
  def sync_audio(room_name, user) do
    GenServer.cast(via_tuple(room_name), {:sync_audio, user})
  end

  @doc """
  Get the PID for the song queue process. Useful when inspecting the entire queue
  """
  def get_users_pid(room_name) do
    GenServer.call(via_tuple(room_name), :get_users_pid)
  end

  @doc """
  Get the PID for the song queue process. Useful when inspecting the entire queue
  """
  def get_queue_pid(room_name) do
    GenServer.call(via_tuple(room_name), :get_queue_pid)
  end

  @doc """
  Get the playback position of the current track.
  """
  def get_playback_pos(room_name) do
    GenServer.call(via_tuple(room_name), :get_playback_pos)
  end

  @doc """
  Gets the currently playing track in the room, or :empty if the queue is empty.
  """
  def current_playing(room_name) do
    GenServer.call(via_tuple(room_name), :current)
  end

  @doc """
  Add a user to the pool of users for the given room specified by the room code.
  """
  def add_user(room_code, user) do
    GenServer.cast(via_tuple(room_code), {:add_user, user})
  end

  @doc """
  Check if the given user is the host for the room
  """
  def is_host?(room_code, user) do
    GenServer.call(via_tuple(room_code), {:is_host?, user})
  end

  @doc """
  Set the threshold for number of votes to skip a song. Can only be set by the host
  of the room.
  """
  @spec set_skip_vote_threshold(room_code :: String.t(), user :: any, threshold :: pos_integer) ::
          {:ok, new_threshold :: pos_integer} | {:error, error_reason :: String.t()}
  def set_skip_vote_threshold(room_code, user, threshold) do
    GenServer.call(via_tuple(room_code), {:set_skip_thresh, user, threshold})
  end

  @doc """
  Votes to skip the track, with some identifier of the source of the skip (typically IP address). If
  there is already a vote to skip from this identifier, return {:error, "already voted"}
  Else, return {:ok, %{num_skips: _, skips_needed: _}, calculated AFTER the skip takes place.
  """
  def vote_skip(room_code, identifier) do
    GenServer.call(via_tuple(room_code), {:vote_skip, identifier})
  end

  @doc """
  Gets the amount of votes needed to skip the current playback
  """
  def get_skip_thresh(room_code) do
    GenServer.call(via_tuple(room_code), :get_skip_thresh)
  end

  @doc """
  Remove a user from the pool of users for the given room specified by the room code.
  """
  def remove_user(room_name, user) do
    GenServer.cast(via_tuple(room_name), {:remove_user, user})
  end

  defp via_tuple(room_name) do
    {:via, :gproc, {:n, :l, {:jukebox_room, room_name}}}
  end

  ## Genserver impl

  @impl true
  def init(init_arg) do
    {:ok, init_arg}
  end

  @impl true
  def handle_call(
        :play_next,
        _from,
        server
      ) do
    Logger.info("Playing next song in room '#{server.room_code}'")
    next_song = play_next_internal(server)
    {:reply, next_song, server}
  end

  @impl true
  def handle_call(
        {:add_to_queue, url: "spotify:track:" <> track_id, submitter: submitter},
        _from,
        server
      ) do
    Logger.info("Adding track with id '#{track_id}' in room '#{server.room_code}'")

    {:ok, spotify_track} =
      HillsideJukebox.Auth.Spotify.call_for_client(
        &DeSpotify.Tracks.get_track/3,
        [track_id, %{}]
      )

    song = HillsideJukebox.Song.from(spotify_track, :largest)
    song = %{song | submitter: submitter}
    add_internal(server, song)
    {:reply, song, server}
  end

  @impl true
  def handle_call(
        :get_users_pid,
        _from,
        server = %HillsideJukebox.JukeboxServer{users_pid: users_pid}
      ) do
    {:reply, users_pid, server}
  end

  @impl true
  def handle_call(
        :get_queue_pid,
        _from,
        server = %HillsideJukebox.JukeboxServer{queue_pid: queue_pid}
      ) do
    {:reply, queue_pid, server}
  end

  @impl true
  def handle_call(
        :get_playback_pos,
        _from,
        server = %HillsideJukebox.JukeboxServer{timer_pid: timer_pid}
      ) do
    {:reply, HillsideJukebox.SongQueue.Timer.get_offset(timer_pid), server}
  end

  @impl true
  def handle_call(:current, _from, server = %HillsideJukebox.JukeboxServer{queue_pid: queue_pid}) do
    current = HillsideJukebox.SongQueue.Server.current(queue_pid)
    {:reply, current, server}
  end

  @impl true
  def handle_call(
        {:is_host?, %User{id: user_id}},
        _from,
        state = %HillsideJukebox.JukeboxServer{users_pid: users_pid}
      ) do
    result = is_host_int?(users_pid, user_id)
    {:reply, result, state}
  end

  @impl true
  def handle_call(
        {:set_skip_thresh, user, threshold},
        _from,
        state = %HillsideJukebox.JukeboxServer{users_pid: users_pid}
      ) do
    Logger.info(
      "User with ID #{user.id} setting skip threshold to #{threshold} in room '#{state.room_code}'"
    )

    case(is_host_int?(users_pid, user.id)) do
      {:ok, true} -> {:reply, {:ok, threshold}, set_vote_threshold(state, threshold)}
      _ -> {:reply, {:error, "not a host"}, state}
    end
  end

  @impl true
  def handle_call(
        {:vote_skip, identifier},
        _from,
        state = %HillsideJukebox.JukeboxServer{skip_log: skip_log}
      ) do
    if MapSet.member?(skip_log, identifier) do
      {:reply, {:error, "already voted"}, state}
    else
      new_state = vote_for_identifier(state, identifier)
      new_skip_state = %{num_skips: new_state.num_skip_votes, skips_needed: new_state.skip_thresh}

      Logger.info(
        "Some user voting to skip in room '#{state.room_code}'. Skip votes: #{
          new_skip_state.num_skips
        }/#{new_skip_state.skips_needed}"
      )

      {:reply, {:ok, new_skip_state}, new_state}
    end
  end

  @impl true
  def handle_call(
        :get_skip_thresh,
        _from,
        state = %HillsideJukebox.JukeboxServer{skip_thresh: thresh}
      ) do
    {:reply, thresh, state}
  end

  @impl true
  def handle_cast({:set_workers, queue_pid, timer_pid, users_pid}, state) do
    num_users = length(HillsideJukebox.UserPool.get_all(users_pid))

    {:noreply,
     %{
       state
       | timer_pid: timer_pid,
         queue_pid: queue_pid,
         users_pid: users_pid,
         num_users: num_users
     }}
  end

  @impl true
  def handle_cast(
        {:add_user, user},
        state = %HillsideJukebox.JukeboxServer{users_pid: users_pid, num_users: num_users}
      ) do
    Logger.info("Adding user with id '#{user.id}' to room '#{state.room_code}'")

    case HillsideJukebox.UserPool.add_user(users_pid, user) do
      {:error, :already_in_pool} -> {:noreply, state}
      {:ok, _new_user} -> {:noreply, %{state | num_users: num_users + 1}}
    end
  end

  @impl true
  def handle_cast(
        {:remove_user, %HillsideJukebox.User{id: id}},
        state = %HillsideJukebox.JukeboxServer{users_pid: users_pid, num_users: num_users}
      ) do
    Logger.info("Removing user with id '#{id}' from room '#{state.room_code}'")
    HillsideJukebox.UserPool.remove_with_user_id(users_pid, id)
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
    Logger.info("Syncing audio for user with id '#{user.id}' in room '#{server.room_code}'")
    offset = HillsideJukebox.SongQueue.Timer.get_offset(timer_pid)

    case offset do
      :not_started -> nil
      offset -> play_with_offset_for_user(user, offset, server)
    end

    {:noreply, server}
  end

  defp play_next_internal(
         server = %HillsideJukebox.JukeboxServer{
           room_code: room_code,
           queue_pid: queue_pid
         }
       ) do
    # Why are we popping and then getting current? Really could be done in one step
    next = HillsideJukebox.SongQueue.Server.next(queue_pid)
    HjWeb.Endpoint.broadcast!("queue", "queue:pop:" <> room_code, next)
    next_song = HillsideJukebox.SongQueue.Server.current(queue_pid)
    # HillsideJukebox.UserPool.reset_skip_votes(users_pid)
    play_and_autoplay_next(next_song, server)
    next_song
  end

  defp skip_current_song(
         server = %HillsideJukebox.JukeboxServer{
           timer_pid: timer_pid
         }
       ) do
    HillsideJukebox.SongQueue.Timer.cancel(timer_pid)
    play_next_internal(server)
  end

  defp play_and_autoplay_next(
         song = %HillsideJukebox.Song{duration: duration},
         _server = %HillsideJukebox.JukeboxServer{
           room_code: room_code,
           timer_pid: timer_pid,
           users_pid: users_pid
         }
       ) do
    HillsideJukebox.Player.play(users_pid, room_code, song)
    HillsideJukebox.SongQueue.Timer.timeout(timer_pid, duration)
    song
  end

  defp play_and_autoplay_next(:empty, %HillsideJukebox.JukeboxServer{
         room_code: room_code,
         users_pid: users_pid
       }) do
    HjWeb.Endpoint.broadcast!("queue:" <> room_code, "queue:empty", %{})
    HillsideJukebox.Player.pause(users_pid)
  end

  defp play_with_offset_for_user(
         user,
         offset_ms,
         _server = %HillsideJukebox.JukeboxServer{
           queue_pid: queue_pid
         }
       ) do
    current_song = HillsideJukebox.SongQueue.Server.current(queue_pid)
    HillsideJukebox.Player.play_at_for_user(user, current_song, offset_ms)
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

  defp vote_for_identifier(
         state = %HillsideJukebox.JukeboxServer{
           skip_log: skip_log,
           num_skip_votes: old_vote_num
         },
         identifier
       ) do
    new_skip_log = MapSet.put(skip_log, identifier)
    new_skip_votes = MapSet.size(new_skip_log)

    new_state = %{state | skip_log: new_skip_log, num_skip_votes: new_skip_votes}
    Logger.debug("Skip state old #{inspect(old_vote_num)} new #{inspect(new_skip_votes)}")

    if old_vote_num != new_skip_votes do
      update_skip_state(new_state)
    else
      new_state
    end
  end

  defp set_vote_threshold(state, threshold) do
    new_state = %{state | skip_thresh: threshold}
    update_skip_state(new_state)
  end

  defp check_skip!(
         state = %HillsideJukebox.JukeboxServer{
           skip_thresh: skip_thresh,
           num_skip_votes: num_skip_votes
         }
       ) do
    if num_skip_votes >= skip_thresh do
      skip!(state)
    else
      state
    end
  end

  defp update_skip_state(state) do
    new_skip_state = check_skip!(state)

    HjWeb.Endpoint.broadcast(
      "user_anon:" <> state.room_code,
      "user_anon:skip_state",
      %{num_skips: state.num_skip_votes, skips_needed: state.skip_thresh}
    )

    new_skip_state
  end

  defp skip!(state) do
    %{state | num_skip_votes: 0, skip_log: MapSet.new()}
    new_song = skip_current_song(state)
    HjWeb.Endpoint.broadcast!("user_anon:" <> state.room_code, "user_anon:song_skipped", new_song)
  end

  defp is_host_int?(users_pid, user_id) do
    case HillsideJukebox.UserPool.get_host(users_pid) do
      {:ok, host_user_id} -> {:ok, user_id == host_user_id}
      error -> error
    end
  end
end
