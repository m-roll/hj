defmodule HjWeb.QueueChannel do
  require Logger
  use Phoenix.Channel

  def join("queue", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("queue:add", payload, socket) do
    song =
      HillsideJukebox.JukeboxServer.add_to_queue(
        payload["spotifyAccessToken"],
        "test",
        payload["songInput"]
      )

    broadcast!(socket, "song:processed", %{
      user: "Anonymous user",
      song: song
    })

    {:noreply, socket}
  end
end
