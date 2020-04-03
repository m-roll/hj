defmodule HjWeb.StatusChannel do
  use Phoenix.Channel

  def join("status", _payload, socket) do
    {:ok, socket}
  end

  def handle_in(
        "status:current:" <> roomCode,
        _payload,
        socket
      ) do
    current = HillsideJukebox.JukeboxServer.current_playing(roomCode)

    {:reply, {:ok, current}, socket}
  end
end
