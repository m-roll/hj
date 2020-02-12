defmodule HillsideJukebox.JukeboxServer do
  use GenServer
  require Logger

  ## API

  def start_link(workers, room_name) do
    Logger.debug("Starting jukebox with name #{inspect(room_name)}")
    GenServer.start_link(__MODULE__, workers, name: via_tuple(room_name))
  end

  def add_to_queue(room_name, url) do
    Logger.debug("adding song to room '#{room_name}' with url '#{inspect(url)}")
    GenServer.call(via_tuple(room_name), {:add_to_queue, url: url})
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
  def handle_call(:play_next, _from, {queue_pid, timer_pid}) do
    next_song = play_next_internal({queue_pid, timer_pid})
    {:reply, next_song, {queue_pid, timer_pid}}
  end

  @impl true
  def handle_call({:add_to_queue, url: url}, _from, {queue_pid, timer_pid}) do
    song = HillsideJukebox.URLs.get_song(url)
    Logger.debug("queue empty: #{inspect(HillsideJukebox.SongQueue.Server.is_empty(queue_pid))}")

    if HillsideJukebox.SongQueue.Server.is_empty(queue_pid) do
      HillsideJukebox.SongQueue.Server.add(queue_pid, song)
      play_next_internal({queue_pid, timer_pid})
    else
      HillsideJukebox.SongQueue.Server.add(queue_pid, song)
    end

    {:reply, song, {queue_pid, timer_pid}}
  end

  @impl true
  def handle_cast({:play_next, workers}, _) do
    {:noreply, workers}
  end

  @impl true
  def handle_cast({:set_workers, queue_pid, timer_pid}, _state) do
    {:noreply, {queue_pid, timer_pid}}
  end

  defp play_next_internal({queue_pid, timer_pid}) do
    next_song = HillsideJukebox.SongQueue.Server.next(queue_pid)
    HillsideJukebox.Player.play(next_song)
    Logger.debug("playing next song")
    # TODO make this the actual song length
    HillsideJukebox.SongQueue.Timer.timeout(timer_pid, 1000)
    next_song
  end
end
