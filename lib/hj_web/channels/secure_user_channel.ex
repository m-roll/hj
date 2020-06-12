defmodule HjWeb.SecureUserChannel do
  use Phoenix.Channel
  require Logger

  alias HillsideJukebox.{User}

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
    {:reply, register_user(room_code(socket), live_user(socket)), socket}
  end

  defp register_user(room_code, user = %User{room_active: nil}) do
    HillsideJukebox.JukeboxServer.add_user(room_code, user)
    HillsideJukebox.Accounts.set_active_room(user, room_code)
    HillsideJukebox.JukeboxServer.sync_audio(room_code, user)
    :ok
  end

  defp register_user(room_code, _) do
    {:ok, error_already_active(room_code)}
  end

  def handle_in("user:unregister", _payload, socket) do
    eject_user_sync(socket)

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

  def handle_in("user:set_device", payload, socket) do
    user = live_user(socket)
    device_id = payload["deviceId"]

    case check_correct_room(socket, user) do
      :ok ->
        do_transfer_device(user, device_id)
        {:reply, :ok, socket}

      {:error, :not_set} ->
        do_transfer_device(user, device_id)
        {:reply, :ok, socket}

      {:error, %{active_room: active_room}} ->
        {:reply, {:ok, error_already_active(active_room)}, socket}
    end
  end

  defp do_transfer_device(user, device_id) do
    {:ok, :no_content} =
      HillsideJukebox.Auth.Spotify.call_for_user(user, &DeSpotify.Player.transfer_device/3, [
        [device_id],
        %{}
      ])
  end

  def handle_in("user:get_authority", _payload, socket) do
    user = socket_user(socket)
    is_host_or_error = HillsideJukebox.JukeboxServer.is_host?(user)
    {:reply, is_host_or_error, socket}
  end

  def terminate(_reason, socket) do
    eject_user_sync(socket)
  end

  defp eject_user_sync(socket) do
    user = live_user(socket)

    case check_correct_room(socket, user) do
      :ok ->
        HillsideJukebox.Player.stop_playback_for_user(user)
        remove_user_from_pool(socket)
        HillsideJukebox.Accounts.set_active_room(user, nil)

      _ ->
        nil
    end
  end

  defp error_already_active(room_code) do
    %{error: %{message: "already active", room_code: room_code}}
  end

  def broadcast_new_host(room_code) do
    HjWeb.broadcast!("user:" <> room_code, "user:new_host")
  end

  defp check_correct_room(socket, user) do
    if (active_room = user.room_active) == room_code(socket) do
      :ok
    else
      if active_room == nil do
        {:error, :not_set}
      else
        {:error, %{active_room: active_room}}
      end
    end
  end

  defp room_code(socket) do
    %Phoenix.Socket{topic: "user:" <> room_code} = socket
    room_code
  end

  defp socket_user(socket) do
    %Phoenix.Socket{assigns: %{user: user}} = socket
    user
  end

  defp live_user(socket) do
    %Phoenix.Socket{assigns: %{user: %User{id: user_id}}} = socket
    HillsideJukebox.Accounts.get(user_id)
  end

  defp remove_user_from_pool(socket) do
    HillsideJukebox.JukeboxServer.remove_user(room_code(socket), socket_user(socket))
  end
end
