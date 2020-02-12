defmodule HillsideJukebox.JukeboxServer do
  use GenServer
  require Logger

  ## API

  def start_link(workers, room_name) do
    Logger.debug("Starting jukebox with name #{inspect(room_name)}")
    GenServer.start_link(__MODULE__, workers, name: via_tuple(room_name))
  end

  def add_to_queue(access_token, room_name, url) do
    Logger.debug("adding song to room '#{room_name}' with url '#{inspect(url)}")
    GenServer.call(via_tuple(room_name), {:add_to_queue, url: url, access_token: access_token})
  end

  def play_next(room_name) do
    GenServer.call(via_tuple(room_name), :play_next)
  end

  def set_workers(room_name, queue_pid, timer_pid) do
    GenServer.cast(via_tuple(room_name), {:set_workers, queue_pid, timer_pid})
  end

  def get_current_song(pid) do
  end

  defp via_tuple(room_name) do
    {:via, :gproc, {:n, :l, {:jukebox_room, room_name}}}
  end

  ## Genserver impl
  ## State is a {pid, pid} tuple where the first pid is the queue process and the second the timer process

  @impl true
  def handle_call(:play_next, _from, workers = {queue_pid, timer_pid}) do
    HillsideJukebox.SongQueue.Server.next(queue_pid)
    next_song = HillsideJukebox.SongQueue.Server.current(queue_pid)
    play_and_autoplay_next(next_song, workers)
    {:reply, next_song, workers}
  end

  @impl true
  def handle_call(
        {:add_to_queue, url: url, access_token: at},
        _from,
        workers = {queue_pid, timer_pid}
      ) do
    %HillsideJukebox.User{spotify_credentials: creds} =
      HillsideJukebox.Users.get_by_access_token(at)

    song = HillsideJukebox.URLs.get_song(url, creds)

    if HillsideJukebox.SongQueue.Server.is_empty(queue_pid) do
      # If empty, play the first song as soon as it's added
      HillsideJukebox.SongQueue.Server.add(queue_pid, song)
      play_and_autoplay_next(song, workers)
    else
      HillsideJukebox.SongQueue.Server.add(queue_pid, song)
    end

    {:reply, song, {queue_pid, timer_pid}}
  end

  @impl true
  def handle_cast({:set_workers, queue_pid, timer_pid}, _state) do
    {:noreply, {queue_pid, timer_pid}}
  end

  defp play_and_autoplay_next(song, {queue_pid, timer_pid}) do
    res = HillsideJukebox.Player.play(song)
    HillsideJukebox.SongQueue.Timer.timeout(timer_pid, 10000)
    song
  end

  defp is_currently_playing({queue_pid, timer_pid}) do
  end
end
