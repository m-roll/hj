defmodule HjWeb.UserChannel do
  use Phoenix.Channel
  require Logger

  def join("user", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("user:create_room", payload, socket = %Phoenix.Socket{join_ref: join_ref}) do
    new_code = HillsideJukebox.Room.Manager.create()
    {:reply, {:ok, %{"room_code" => new_code}}, socket}
  end

  def handle_in(
        "user:register:" <> roomCode,
        payload,
        socket = %Phoenix.Socket{join_ref: join_ref}
      ) do
    spotify_credentials = HjWeb.Socket.Util.Users.spotify_credentials_from_payload(payload)

    spotify_device_id = payload["deviceId"]
    users_pid = HillsideJukebox.JukeboxServer.get_users_pid(roomCode)
    user_id = join_ref

    {new_user, _} =
      HillsideJukebox.Users.add_user(users_pid, user_id, spotify_credentials, spotify_device_id)

    Logger.debug("Sync for user #{inspect(new_user)}")
    HillsideJukebox.JukeboxServer.sync_audio(roomCode, new_user)
    {:noreply, socket}
  end

  def handle_in(
        "user:vote_skip:" <> roomCode,
        payload,
        socket = %Phoenix.Socket{join_ref: join_ref}
      ) do
    HillsideJukebox.JukeboxServer.vote_skip(roomCode, join_ref)

    {:noreply, socket}
  end

  def terminate(_reason, socket = %Phoenix.Socket{join_ref: join_ref}) do
    # users_pid = HillsideJukebox.JukeboxServer.get_users_pid(payload["r0omCode"]) How do we fix this?
    # HillsideJukebox.Users.remove_with_user_id(users_pid, join_ref)
  end
end
