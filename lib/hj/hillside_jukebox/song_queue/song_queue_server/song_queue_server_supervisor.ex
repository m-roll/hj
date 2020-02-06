defmodule HillsideJukebox.SongQueue.Server.Supervisor do
  use Supervisor

  def start_link(stash_pid) do
    IO.puts("Started server supervisor")
    HillsideJukebox.SongQueue.Server.start_link(stash_pid)
  end

  def init(stash_pid) do
    children = [{SongQueue.Server, stash_pid}]
    IO.puts("Server supervisor init")
    Supervisor.init(children, strategy: :one_for_one)
  end
end
