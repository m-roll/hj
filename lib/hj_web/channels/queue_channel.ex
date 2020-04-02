defmodule HjWeb.QueueChannel do
  require Logger
  use Phoenix.Channel

  def join("queue", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("queue:fetch:" <> roomCode, _payload, socket) do
    queue =
      HillsideJukebox.SongQueue.Server.fetch(
        HillsideJukebox.JukeboxServer.get_queue_pid(roomCode)
      )

    {:reply, {:ok, %{queue: :queue.to_list(queue)}}, socket}
  end

  def handle_in("queue:add:" <> roomCode, payload, socket) do
    song =
      HillsideJukebox.JukeboxServer.add_to_queue(
        roomCode,
        payload["songInput"]
      )

    Logger.debug("SENDING PROCESSED BROADCAST: #{roomCode}")

    broadcast!(socket, "song:processed:" <> roomCode, %{
      user: "Anonymous user",
      song: song
    })

    {:noreply, socket}
  end
end
