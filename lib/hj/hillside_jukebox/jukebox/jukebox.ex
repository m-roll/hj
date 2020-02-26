defmodule HillsideJukebox.JukeboxServer do
  use GenServer
  require Logger

  ## API

  def start_link(workers, room_name) do
    Logger.debug("Starting jukebox with name #{inspect(room_name)}")
    GenServer.start_link(__MODULE__, workers, name: via_tuple(room_name))
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

  defp via_tuple(room_name) do
    {:via, :gproc, {:n, :l, {:jukebox_room, room_name}}}
  end

  ## Genserver impl
  ## State is a {pid, pid} tuple where the first pid is the queue process and the second the timer process

  @impl true
  def handle_call(:play_next, _from, workers = {queue_pid, timer_pid, users_pid}) do
    # Why are we popping and then getting current? Really could be done in one step
    next = HillsideJukebox.SongQueue.Server.next(queue_pid)
    # Again, need a way to broadcast this only to a room code
    HjWeb.Endpoint.broadcast!("queue", "queue:pop", next)
    next_song = HillsideJukebox.SongQueue.Server.current(queue_pid)
    play_and_autoplay_next(next_song, workers)
    {:reply, next_song, workers}
  end

  def handle_call(
        {:add_to_queue, url: url},
        _from,
        workers = {_, _, users_pid}
      ) do
    %HillsideJukebox.User{spotify_credentials: creds} = HillsideJukebox.Users.get_host(users_pid)

    song = HillsideJukebox.URLs.get_song(url, creds)

    add_internal(workers, song)
  end

  def handle_call(:get_users_pid, _from, workers = {_, _, users_pid}) do
    {:reply, users_pid, workers}
  end

  def handle_call(:get_queue_pid, _from, workers = {queue_pid, _, _}) do
    {:reply, queue_pid, workers}
  end

  @impl true
  def handle_cast({:set_workers, queue_pid, timer_pid, users_pid}, _state) do
    {:noreply, {queue_pid, timer_pid, users_pid}}
  end

  @impl true
  def handle_cast({:sync_audio, user}, workers = {queue_pid, timer_pid, users_pid}) do
    case HillsideJukebox.SongQueue.Timer.get_offset(timer_pid) do
      :not_started -> nil
      offset -> play_with_offset_for_user(user, offset, queue_pid)
    end

    {:noreply, workers}
  end

  @impl true
  def handle_cast({:add_user, creds}, workers = {queue_pid, timer_pid, users_pid}) do
    new_user = HillsideJukebox.Users.add_credentials(users_pid, creds)

    {:noreply, workers}
  end

  defp play_and_autoplay_next(
         song = %HillsideJukebox.Song{duration: duration},
         {queue_pid, timer_pid, users_pid}
       ) do
    users = HillsideJukebox.Users.get_all(users_pid)
    res = HillsideJukebox.Player.play(users, song)
    HillsideJukebox.SongQueue.Timer.timeout(timer_pid, duration)
    song
  end

  defp play_with_offset_for_user(user, offset_ms, queue_pid) do
    current_song = HillsideJukebox.SongQueue.Server.current(queue_pid)
    HillsideJukebox.Player.play_at_for_user(user, current_song, offset_ms)
  end

  defp add_internal(workers = {queue_pid, timer_pid, users_pid}, song) do
    if HillsideJukebox.SongQueue.Server.is_empty(queue_pid) do
      # If empty, play the first song as soon as it's added
      HillsideJukebox.SongQueue.Server.add(queue_pid, song)
      play_and_autoplay_next(song, workers)
    else
      HillsideJukebox.SongQueue.Server.add(queue_pid, song)
    end

    {:reply, song, {queue_pid, timer_pid, users_pid}}
  end

  defp is_currently_playing({queue_pid, timer_pid, users_pid}) do
  end
end
