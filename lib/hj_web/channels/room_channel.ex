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

  def handle_in(
        "room:exists",
        %{"roomCode" => room_code} = _payload,
        socket
      ) do
    if HillsideJukebox.Room.Manager.exists?(room_code) do
      {:reply, {:ok, %{created: true, room_code: room_code}}, socket}
    else
      {:reply, {:ok, %{created: false}}, socket}
    end
  end
end
