defmodule HjWeb.SecureUserChannel do
  use Phoenix.Channel
  require Logger

  def join("user:" <> _roomCode, _payload, socket) do
    {:ok, socket}
  end

  def handle_in("user:create_room", _payload, socket) do
    new_code = HillsideJukebox.Room.Manager.create()
    {:reply, {:ok, %{"room_code" => new_code}}, socket}
  end

  def handle_in(
        "user:register",
        _payload,
        socket
      ) do
    {new_user, _} = HillsideJukebox.JukeboxServer.add_user(room_code(socket), socket_user(socket))

    HillsideJukebox.JukeboxServer.sync_audio(room_code(socket), new_user)
    {:noreply, socket}
  end

  def handle_in(
        "user:vote_skip",
        _payload,
        socket
      ) do
    HillsideJukebox.JukeboxServer.vote_skip(room_code(socket), socket_user(socket))

    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    HillsideJukebox.JukeboxServer.remove_user(room_code(socket), socket_user(socket))
  end

  defp room_code(socket) do
    %Phoenix.Socket{topic: "user:" <> room_code} = socket
    room_code
  end

  defp socket_user(socket) do
    %Phoenix.Socket{assigns: %{"user" => user}} = socket
    user
  end
end
