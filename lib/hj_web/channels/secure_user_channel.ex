defmodule HjWeb.SecureUserChannel do
  use Phoenix.Channel
  require Logger

  def join("user:" <> _roomCode, _payload, socket) do
    {:ok, socket}
  end

  def handle_in("user:create_room", _payload, socket) do
    new_code = HillsideJukebox.Room.Manager.create()
    {:reply, {:ok, %{"room_code" => new_code}}, socket}
  end

  def handle_in(
        "user:register",
        _payload,
        socket
      ) do
    HillsideJukebox.JukeboxServer.add_user(room_code(socket), socket_user(socket))

    HillsideJukebox.JukeboxServer.sync_audio(room_code(socket), socket_user(socket))
    {:noreply, socket}
  end

  def handle_in("user:unregister", _payload, socket) do
    HillsideJukebox.Player.stop_playback_for_user(socket_user(socket))
    remove_user_from_pool(socket)

    {:noreply, socket}
  end

  def handle_in("user:refresh_credentials", _payload, socket) do
    user = %HillsideJukebox.User{refresh_token: refresh_token} = socket_user(socket)
    res = {:ok, new_access_token} = DeSpotify.Auth.refresh(refresh_token)

    user_socket =
      case HillsideJukebox.Accounts.update_access_token(user, new_access_token) do
        {:ok, new_user} -> HjWeb.SecureUserSocket.assign_user(socket, user: new_user)
        _ -> socket
      end

    {:reply, res, user_socket}
  end

  def handle_in("user:get_devices", _payload, socket) do
    user = socket_user(socket)
    res = HillsideJukebox.Auth.Spotify.call_for_user(user, &DeSpotify.Player.get_devices/2, [%{}])
    {:reply, res, socket}
  end

  def handle_in(
        "user:vote_skip",
        _payload,
        socket
      ) do
    HillsideJukebox.JukeboxServer.vote_skip(room_code(socket), socket_user(socket))

    {:noreply, socket}
  end

  def handle_in("user:set_device", payload, socket) do
    user = socket_user(socket)
    device_id = payload["deviceId"]

    {:ok, :no_content} =
      HillsideJukebox.Auth.Spotify.call_for_user(user, &DeSpotify.Player.transfer_device/3, [
        [device_id],
        %{}
      ])

    {:reply, :ok, socket}
  end

  def terminate(_reason, socket) do
    user = socket_user(socket)

    # TODO only pause if the current song is the same one currently in queue.
    HillsideJukebox.Player.stop_playback_for_user(socket_user(socket))

    remove_user_from_pool(socket)
  end

  defp room_code(socket) do
    %Phoenix.Socket{topic: "user:" <> room_code} = socket
    room_code
  end

  defp socket_user(socket) do
    %Phoenix.Socket{assigns: %{user: user}} = socket
    user
  end

  defp remove_user_from_pool(socket) do
    HillsideJukebox.JukeboxServer.remove_user(room_code(socket), socket_user(socket))
  end
end
