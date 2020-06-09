defmodule HillsideJukebox.Jukebox.Supervisor do
  require Logger
  use Supervisor

  def start_link(name) do
    result = {:ok, pid} = Supervisor.start_link(__MODULE__, name)
    result
  end

  def init(name) do
    me = self()
    setup_jukebox = fn -> setup(name, me) end

    children = [
      HillsideJukebox.UserPool,
      {HillsideJukebox.SongQueue.Server, :queue.new()},
      {HillsideJukebox.SongQueue.Timer, fn -> HillsideJukebox.JukeboxServer.play_next(name) end},
      %{
        id: HillsideJukebox.JukeboxServer,
        # Need to find a way to init this with the correct PIDs instead of the task below it
        start: {HillsideJukebox.JukeboxServer, :start_link, [nil, name]}
      },
      %{id: Task, start: {Task, :start_link, [setup_jukebox]}, restart: :transient}
    ]

    Supervisor.init(children, strategy: :rest_for_one)
  end

  defp setup(name, pid) do
    users_pid = find_child(pid, HillsideJukebox.UserPool)
    queue_pid = find_child(pid, HillsideJukebox.SongQueue.Server)
    timer_pid = find_child(pid, HillsideJukebox.SongQueue.Timer)
    HillsideJukebox.JukeboxServer.set_workers(name, queue_pid, timer_pid, users_pid)
  end

  defp find_child(pid, find_id) do
    {_, child_pid, _, _} =
      Supervisor.which_children(pid)
      |> Enum.find(fn {id, _, _, _} ->
        find_id == id
      end)

    child_pid
  end
end
