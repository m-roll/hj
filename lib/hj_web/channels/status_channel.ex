defmodule HjWeb.StatusChannel do
  use Phoenix.Channel

  def join("status", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("status:current", payload, socket = %Phoenix.Socket{join_ref: join_ref}) do
    current = HillsideJukebox.JukeboxServer.current_playing("test")

    {:reply, {:ok, current}, socket}
  end
end
