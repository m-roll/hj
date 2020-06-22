defmodule HjWeb.QueueChannel do
  require Logger
  use Phoenix.Channel

  def join("queue:" <> _room_code, _payload, socket) do
    {:ok, socket}
  end

  def handle_in("queue:fetch", _payload, socket) do
    queue =
      HillsideJukebox.SongQueue.Server.fetch(
        HillsideJukebox.JukeboxServer.get_queue_pid(room_code(socket))
      )

    {:reply, {:ok, %{queue: :queue.to_list(queue)}}, socket}
  end

  def handle_in("queue:add", payload, socket) do
    room_code = room_code(socket)

    song =
      HillsideJukebox.JukeboxServer.add_to_queue(
        room_code,
        payload["songInput"],
        payload["user"]
      )

    broadcast!(socket, "song:processed:" <> room_code, %{
      song: song
    })

    {:noreply, socket}
  end

  defp room_code(socket) do
    %Phoenix.Socket{topic: "queue:" <> room_code} = socket
    room_code
  end
end
