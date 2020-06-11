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
    room_code = socket |> room_code
    current = HillsideJukebox.JukeboxServer.current_playing(room_code)

    playback_pos = HillsideJukebox.JukeboxServer.get_playback_pos(room_code)

    {:reply, {:ok, %{song: current, playback_pos: playback_pos}}, socket}
  end

  defp room_code(socket) do
    %Phoenix.Socket{topic: "status:" <> room_code} = socket
    room_code
  end
end
