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

  def handle_in("user:unregister", _payload, socket) do
    eject_user_sync(socket)

    {:reply, :ok, socket}
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

  def handle_in("user:get_authority", _payload, socket) do
    user = socket_user(socket)
    is_host_or_error = HillsideJukebox.JukeboxServer.is_host?(room_code(socket), user)

    {:reply, get_host_response(is_host_or_error), socket}
  end

  defp get_host_response({:ok, is_host}) do
    {:ok, %{is_host: is_host}}
  end

  defp get_host_response(error_tuple = {:error, _}) do
    error_tuple
  end

  def handle_in("user:prefs_get", _payload, socket) do
    skip_thresh = HillsideJukebox.JukeboxServer.get_skip_thresh(room_code(socket))
    user_prefs = HillsideJukebox.UserPreferences.get_or_create(socket_user(socket))
    {:reply, {:ok, prefs_payload(skip_thresh, user_prefs)}, socket}
  end

  def handle_in("user:prefs_save", payload, socket) do
    user = socket_user(socket)
    HillsideJukebox.UserPreferences.save(user, prefs_changeset_from(payload))
    # TODO if host, save the vote threshold number
    {:ok, is_host} = HillsideJukebox.JukeboxServer.is_host?(room_code(socket), user)
    {:reply, :ok, socket}
  end

  def terminate(_reason, socket) do
    eject_user_sync(socket)
  end

  defp do_transfer_device(user, device_id) do
    {:ok, :no_content} =
      HillsideJukebox.Auth.Spotify.call_for_user(user, &DeSpotify.Player.transfer_device/3, [
        [device_id],
        %{}
      ])
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
    HjWeb.Endpoint.broadcast!("user:" <> room_code, "user:new_host", %{})
  end

  defp check_correct_room(socket, %HillsideJukebox.User{room_active: user_room}) do
    room_claim = room_code(socket)

    result =
      case user_room do
        ^room_claim ->
          :ok

        nil ->
          {:error, :not_set}

        active_room ->
          if HillsideJukebox.Room.Manager.exists?(active_room) do
            {:error, %{active_room: active_room}}
          else
            {:error, :not_set}
          end
      end

    Logger.debug(
      "Checking correcto room. Claiming room #{inspect(room_claim)} but is active in #{
        inspect(user_room)
      }. Result: #{inspect(result)}"
    )

    result
  end

  defp prefs_changeset_from(payload) do
    %{
      nickname: Map.get(payload, "nickname")
    }
  end

  defp prefs_payload(skip_thresh, user_prefs) do
    %{
      skip_thresh: skip_thresh,
      nickname: Map.get(user_prefs, :nickname)
    }
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

  defp register_user(room_code, user) do
    HillsideJukebox.JukeboxServer.add_user(room_code, user)
    HillsideJukebox.Accounts.set_active_room(user, room_code)
    Logger.debug("Should be syncing")
    HillsideJukebox.JukeboxServer.sync_audio(room_code, user)
    is_host = HillsideJukebox.JukeboxServer.is_host?(room_code, user)
    get_host_response(is_host)
  end
end
