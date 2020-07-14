defmodule HjWeb.PageController do
  use HjWeb, :controller
  require Logger

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def auth(conn, params) do
    {conn, redirect_url} = SpotifyController.OAuthController.authenticate(conn, params)

    redirect(conn, to: redirect_url)
  end

  def authorize(conn, params) do
    SpotifyController.OAuthController.authorize(conn, params)
  end

  def create_room(conn, _params) do
    new_code = HillsideJukebox.Room.Manager.create()
    Logger.debug("Creating room #{new_code}")
    redirect(conn, to: "/room/#{new_code}/listen")
  end

  def listen(conn, params) do
    jukebox(conn, Map.put(params, "listen", true))
  end

  def jukebox(conn, params) do
    fields =
      %{}
      |> Map.merge(handle_room_fields(conn, params))
      |> Map.merge(handle_user_fields(conn, params))
      |> Map.merge(handle_meta_fields(conn, params))

    render(conn, "index.html", fields)
  end

  def disconnect(conn, params) do
    user = HjWeb.Guardian.Plug.current_resource(conn)
    Logger.info("Attempting to disconnect user with id '#{user.id}' at their request.")
    HillsideJukebox.Accounts.disconnect(user)
    conn = HjWeb.Guardian.Plug.sign_out(conn)
    redirect(conn, to: "/disconnect-success")
  end

  def disconnect_success(conn, _params) do
    render(conn, "disconnect_success.html", %{hj_web_host: get_host()})
  end

  defp handle_room_fields(_conn, params) do
    case Map.fetch(params, "room_code") do
      {:ok, room_code} -> %{has_room_code: true, room_code: String.downcase(room_code)}
      _ -> %{has_room_code: false}
    end
  end

  defp handle_user_fields(conn, _params) do
    case Guardian.Plug.current_token(conn) do
      nil ->
        %{has_credentials: false}

      resource_token ->
        %{has_credentials: true, hj_resource_token: resource_token, spotify_access_token: nil}
    end
  end

  defp handle_meta_fields(_conn, params) do
    listening_map =
      case Map.fetch(params, "listen") do
        {:ok, true} -> %{hj_listening: true}
        _ -> %{hj_listening: false}
      end

    Map.merge(%{hj_web_host: get_host()}, listening_map)
  end

  defp get_host() do
    endpoint_config = Application.get_env(:hj, HjWeb.Endpoint, :url)
    url_config = Keyword.get(endpoint_config, :url)
    %URI{host: host_name, path: path_name} = URI.parse(Keyword.get(url_config, :host))
    host_name || path_name
  end
end
