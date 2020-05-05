defmodule HjWeb.SearchChannel do
  use Phoenix.Channel

  def join("search:", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("search:do:" <> roomCode, payload, socket) do
    results = HillsideJukebox.Search.song(roomCode, payload["query"])
    {:reply, {:ok, %{truncated_results: results}}, socket}
  end
end