defmodule HillsideJukebox.Room.Manager do
  require Logger

  def create() do
    new_code = HillsideJukebox.Room.CodesRegistry.take()
    Logger.info("Generated room code '#{new_code}'")
    HillsideJukebox.Room.Supervisor.start_room(new_code)
    new_code
  end

  def remove(room_code) do
    # HillsideJukebox.Room.Supervisor.terminate_room(code)
    HillsideJukebox.Room.CodesRegistry.retire(room_code)
  end

  def exists?(room_code) do
    HillsideJukebox.Room.CodesRegistry.exists?(to_charlist(room_code))
  end
end
