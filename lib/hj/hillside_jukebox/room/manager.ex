defmodule HillsideJukebox.Room.Manager do
  def create() do
    new_code = HillsideJukebox.Room.CodesRegistry.take()
    HillsideJukebox.Room.Supervisor.start_room(new_code)
    new_code
  end

  def remove(code) do
    # HillsideJukebox.Room.Supervisor.terminate_room(code)
    HillsideJukebox.Room.CodesRegistry.retire(code)
  end
end
