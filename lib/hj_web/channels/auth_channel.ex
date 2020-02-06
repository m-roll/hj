defmodule HjWeb.AuthChannel do
  def join("auth", _payload, socket) do
    {:ok, socket}
  end
end
