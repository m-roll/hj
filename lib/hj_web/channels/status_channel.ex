defmodule HjWeb.StatusChannel do
  use Phoenix.Channel

  def join("status", _payload, socket) do
    {:ok, socket}
  end

  def handle_in(
        "status:current:" <> roomCode,
        _payload,
        _socket = %Phoenix.Socket{join_ref: join_ref}
      ) do
    current = HillsideJukebox.JukeboxServer.current_playing(roomCode)

    {:reply, current, _socket}
  end
end
