defmodule HjWeb.SearchChannel do
  require Logger
  use Phoenix.Channel

  def join("search:" <> _room_code, _payload, socket) do
    {:ok, socket}
  end

  def handle_in("search:query", payload, socket) do
    results = HillsideJukebox.Search.song(payload["query"])
    {:reply, {:ok, %{truncated_results: results}}, socket}
  end

  defp room_code(socket) do
    %Phoenix.Socket{topic: "search:" <> room_code} = socket
    room_code
  end
end
