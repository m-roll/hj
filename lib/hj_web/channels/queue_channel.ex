defmodule HjWeb.QueueChannel do
  use Phoenix.Channel

  def join("queue", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("song:add", payload, socket) do
    song = HillsideJukebox.URLs.get_song(payload["songInput"])

    broadcast!(socket, "song:processed", %{
      user: "Anonymous user",
      song: song
    })

    IO.inspect(song)

    {:noreply, socket}
  end
end
