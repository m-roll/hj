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
    user_id = join_ref
    HillsideJukebox.Users.set_user_id_from_token(users_pid, spotify_access_token, user_id)
    HillsideJukebox.Users.set_device_id(users_pid, user_id, spotify_device_id)
    new_user = HillsideJukebox.Users.get_by_user_id(users_pid, user_id)
    HillsideJukebox.JukeboxServer.sync_audio("test", new_user)
    {:noreply, socket}
  end

  def handle_in("user:vote_skip", payload, socket = %Phoenix.Socket{join_ref: join_ref}) do
    HillsideJukebox.JukeboxServer.vote_skip("test", join_ref)

    {:noreply, socket}
  end

  def terminate(_reason, socket = %Phoenix.Socket{join_ref: join_ref}) do
    users_pid = HillsideJukebox.JukeboxServer.get_users_pid("test")
    HillsideJukebox.Users.remove_with_user_id(users_pid, join_ref)
  end
end
