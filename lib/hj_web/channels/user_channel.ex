defmodule HjWeb.UserChannel do
  use Phoenix.Channel
  require Logger

  def join("user", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("user:register", payload, socket = %Phoenix.Socket{join_ref: join_ref}) do
    spotify_access_token = payload["spotify_access_token"]
    spotify_device_id = payload["spotify_device_id"]

    # Double iteration over the user list is not good. Need to find a clean way to update multiple fields
    #   with some abstraction.
    HillsideJukebox.Users.set_device_id(spotify_access_token, spotify_device_id)
    {:noreply, socket}
  end
end
