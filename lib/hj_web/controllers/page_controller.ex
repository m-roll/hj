defmodule HjWeb.PageController do
  require Logger
  import Plug.Conn
  import Spotify.Authorization
  use HjWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def auth(conn, params) do
    auth_res = SpotifyController.OAuthController.authenticate(conn, params)

    case auth_res do
      {:ok, conn} ->
        redirect(conn, to: "/jukebox")
    end
  end

  def authorize(conn, _params) do
    %Plug.Conn{params: query_params} = fetch_query_params(conn)
    _auth_code = authorize_from_params(conn, Map.fetch(query_params, "code"))
  end

  def jukebox(conn, _params) do
    creds = Spotify.Credentials.new(conn)

    case creds do
      %Spotify.Credentials{access_token: nil} ->
        redirect(conn, to: "/authorize")

      %Spotify.Credentials{} ->
        HillsideJukebox.Users.add_credentials(creds)
    end

    render(conn, "index.html", spotify_access_token: Map.fetch!(creds, :access_token))
  end

  defp authorize_from_params(_conn, {:ok, auth_code}) do
    auth_code
  end

  defp authorize_from_params(conn, :error) do
    SpotifyController.OAuthController.authorize(conn)
  end
end
