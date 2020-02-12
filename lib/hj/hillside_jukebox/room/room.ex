defmodule HillsideJukebox.Room.Supervisor do
  use DynamicSupervisor

  def start_link(_) do
    DynamicSupervisor.start_link(__MODULE__, [], name: __MODULE__)
  end

  def start_room(name) do
    DynamicSupervisor.start_child(__MODULE__, {HillsideJukebox.Jukebox.Supervisor, name})
  end

  def init(_) do
    DynamicSupervisor.init(
      strategy: :one_for_one,
      extra_arguments: []
    )
  end
end
