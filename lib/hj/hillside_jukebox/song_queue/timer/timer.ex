defmodule HillsideJukebox.SongQueue.Timer do
  use GenServer

  # api

  def start_link(callback) when is_function(callback) do
    GenServer.start_link(__MODULE__, callback)
  end

  def timeout(pid, time_ms) do
    GenServer.cast(pid, {:timeout, time_ms})
  end

  def cancel(pid) do
    GenServer.cast(pid, :cancel)
  end

  # Genserver impl

  @impl true
  def init(callback) do
    {:ok, callback}
  end

  @impl true
  def handle_cast({:timeout, time_ms}, callback) do
    Process.sleep(time_ms)
    callback.()
  end

  @impl true
  def handle_cast(:cancel, _) do
    :stop
  end
end
