defmodule HillsideJukebox.SongQueue.Timer do
  use GenServer

  # api

  @spec start_link(fun) :: :ignore | {:error, any} | {:ok, pid}
  def start_link(callback) when is_function(callback) do
    GenServer.start_link(__MODULE__, {callback, :not_started})
  end

  def timeout(pid, time_ms) do
    GenServer.cast(pid, {:timeout, time_ms})
  end

  def get_offset(pid) do
    GenServer.call(pid, :time_diff)
  end

  def cancel(pid) do
    GenServer.cast(pid, :cancel)
  end

  # Genserver impl

  @impl true
  def init(state) do
    {:ok, state}
  end

  @impl true
  def handle_cast({:timeout, time_ms}, {cb, _}) do
    Task.async(fn ->
      Process.sleep(time_ms)
      cb.()
    end)

    {:noreply, {cb, get_time_ms()}}
  end

  @impl true
  def handle_cast(:cancel, _) do
    :stop
  end

  @impl true
  def handle_call(:time_diff, _from, state = {_, time_called}) do
    response =
      case time_called do
        :not_started -> :not_started
        _ -> get_time_ms() - time_called
      end

    {:reply, response, state}
  end

  defp get_time_ms() do
    System.convert_time_unit(System.system_time(), :native, :millisecond)
  end
end
