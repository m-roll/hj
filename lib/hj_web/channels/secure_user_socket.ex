defmodule HjWeb.SecureUserSocket do
  require Logger
  use Phoenix.Socket

  def connect(params = %{"user_token" => jwt}, socket, _connect_info) do
    case sign_in(socket, jwt) do
      {:ok, authed_socket} ->
        Logger.debug("User signed in: #{inspect(authed_socket)}")
        {:ok, assign(authed_socket, room_code: params["room_code"])}

      {:error, "user already connected"} ->
        :error

      _ ->
        :error
    end
  end

  defp sign_in(socket, jwt) do
    HjWeb.Guardian.resource_from_token(jwt)
    |> extract_user()
    |> validate_user()
    |> assign_user(socket)
  end

  defp extract_user({:ok, user, _claims}) do
    Logger.debug("User extracted: #{inspect(user)}")
    {:ok, user}
    # {:ok, %{user | room_active: nil}}
  end

  defp extract_user(_) do
    {:error, :cannot_validate}
  end

  defp validate_user({:ok, user}) do
    {:ok, user}
  end

  def id(_socket), do: nil

  def assign_user({:ok, user}, socket) do
    Logger.debug("Assigning user")
    {:ok, assign(socket, user: user)}
  end

  def assign_user(error_tuple, _socket) do
    {:error, %{message: "Could not assign user to socket connection", reason: error_tuple}}
  end

  channel("queue:*", HjWeb.QueueChannel)
  channel("user:*", HjWeb.SecureUserChannel)
  channel("status:*", HjWeb.StatusChannel)
  channel("room", HjWeb.RoomChannel)
  channel("search:*", HjWeb.SearchChannel)
  channel("user_anon:*", HjWeb.AnonUserChannel)
end
