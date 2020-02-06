defmodule HillsideJukebox.SongQueue.Stash do
  use Agent

  def start_link(init_queue) do
    result = {:ok, _pid} = Agent.start_link(fn -> init_queue end, name: __MODULE__)
    result
  end

  def get_value(pid) do
    Agent.get(pid, & &1)
  end

  def store_value(pid, queue) do
    Agent.update(pid, fn _ -> queue end)
  end
end
