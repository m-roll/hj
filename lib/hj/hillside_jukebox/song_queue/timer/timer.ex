defmodule HillsideJukebox.SongQueue.Timer do
  use GenServer

  # api

  @spec start_link(fun) :: :ignore | {:error, any} | {:ok, pid}
  def start_link(callback) when is_function(callback) do
    GenServer.start_link(__MODULE__, callback)
  end

  def timeout(pid, time_ms) do
    GenServer.cast(pid, {:set_active, true})
    GenServer.cast(pid, {:timeout, time_ms})
  end

  def cancel(pid) do
    GenServer.cast(pid, :cancel)
  end

  # Genserver impl

  @impl true
  def init(callback) do
    {:ok, %{cb: callback, active: false}}
  end

  @impl true
  def handle_cast({:timeout, time_ms}, %{cb: callback}) do
    Process.sleep(time_ms)
    callback.()
    {:noreply, %{cb: callback, active: false}}
  end

  @impl true
  def handle_cast({:set_active, active_state}, %{cb: callback}) do
    {:noreply, %{cb: callback, active: active_state}}
  end

  @impl true
  def handle_cast(:cancel, _) do
    :stop
  end
end
