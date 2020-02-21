defmodule HjWeb.StatusChannel do
  use Phoenix.Channel

  def join("status", _payload, socket) do
    {:ok, socket}
  end
end
