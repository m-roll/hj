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

  def handle_in("user:refresh_credentials", _payload, socket) do
    user = %HillsideJukebox.User{refresh_token: refresh_token} = socket_user(socket)
    Logger.debug("Attempting refresh for AT: #{inspect(refresh_token)}")
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
    res = HillsideJukebox.Auth.Spotify.refresh_do(user, &DeSpotify.Player.get_devices/2, [%{}])
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

  def terminate(_reason, socket) do
    HillsideJukebox.Player.stop_playback_for_user(socket_user(socket))
    HillsideJukebox.JukeboxServer.remove_user(room_code(socket), socket_user(socket))
  end

  defp room_code(socket) do
    %Phoenix.Socket{topic: "user:" <> room_code} = socket
    room_code
  end

  defp socket_user(socket) do
    %Phoenix.Socket{assigns: %{user: user}} = socket
    user
  end
end
