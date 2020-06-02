defmodule HjWeb.SecureUserSocket do
  require Logger
  use Phoenix.Socket

  def connect(params = %{"user_token" => jwt}, socket, _connect_info) do
    case sign_in(socket, jwt, params) do
      {:ok, authed_socket} ->
        {:ok, assign(authed_socket, :room_code, params["room_code"])}

      _ ->
        :error
    end
  end

  defp sign_in(socket, jwt, _params) do
    resource = HjWeb.Guardian.resource_from_token(jwt)

    case resource do
      {:ok, user, _claims} -> {:ok, assign(socket, user: user)}
      _ -> {:error, :cannot_validate}
    end
  end

  def id(_socket), do: nil

  channel("queue:*", HjWeb.QueueChannel)
  channel("user:*", HjWeb.SecureUserChannel)
  channel("status:*", HjWeb.StatusChannel)
  channel("room", HjWeb.RoomChannel)
  channel("search:*", HjWeb.SearchChannel)
end
