defmodule HjWeb.RoomChannel do
  use Phoenix.Channel

  def join("room", _payload, socket) do
    {:ok, socket}
  end

  def handle_in(
        "room:create",
        _payload,
        socket
      ) do
    new_code = HillsideJukebox.Room.Manager.create()
    {:reply, {:ok, %{"room_code" => new_code}}, socket}
  end
end
