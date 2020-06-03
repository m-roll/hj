defmodule HjWeb.StatusChannel do
  use Phoenix.Channel

  def join("status:" <> _room_code, _payload, socket) do
    {:ok, socket}
  end

  def handle_in(
        "status:current",
        _payload,
        socket
      ) do
    current = HillsideJukebox.JukeboxServer.current_playing(room_code(socket))

    {:reply, {:ok, current}, socket}
  end

  defp room_code(socket) do
    %Phoenix.Socket{topic: "status:" <> room_code} = socket
    room_code
  end
end
