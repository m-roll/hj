defmodule HjWeb.UserChannel do
  use Phoenix.Channel
  require Logger

  def join("user", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("user:register", payload, socket = %Phoenix.Socket{join_ref: join_ref}) do
    spotify_access_token = HjWeb.Socket.Util.Users.spotify_access_token_from_payload(payload)
    spotify_device_id = payload["deviceId"]

    # Double iteration over the user list is not good. Need to find a clean way to update multiple fields
    #   with some abstraction.
    Logger.debug("Setting device id: #{spotify_device_id}")
    users_pid = HillsideJukebox.JukeboxServer.get_users_pid("test")
    HillsideJukebox.Users.set_device_id(users_pid, spotify_access_token, spotify_device_id)
    {:noreply, socket}
  end
end
