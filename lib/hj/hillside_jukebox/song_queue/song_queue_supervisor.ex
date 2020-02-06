defmodule HillsideJukebox.SongQueue.Supervisor do
  import HillsideJukebox
  use Supervisor

  def start_link() do
    result = {:ok, pid} = Supervisor.start_link(__MODULE__, nil)
    start_workers(pid, :queue.new())
    result
  end

  def start_workers(pid, initial_queue) do
    {:ok, stash_pid} =
      Supervisor.start_child(pid, {HillsideJukebox.SongQueue.Stash, initial_queue})

    Supervisor.start_child(pid, {HillsideJukebox.SongQueue.Server.Supervisor, stash_pid})
  end

  def init(_) do
    Supervisor.init([], strategy: :one_for_one)
  end
end
