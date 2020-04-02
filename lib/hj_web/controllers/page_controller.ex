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
        redirect(conn, to: "/" <> Map.fetch!(params, "state") <> "/listen")
    end
  end

  def authorize(conn, _params) do
    %Plug.Conn{params: query_params} = fetch_query_params(conn)
    _auth_code = authorize_from_params(conn, query_params)
  end

  def create_room(conn, _params) do
    new_code = HillsideJukebox.Room.Manager.create()
    redirect(conn, to: "/authorize?state=" <> new_code)
  end

  def listen(conn, params) do
    jukebox(conn, Map.put(params, "listen", true))
  end

  def jukebox(conn, params) do
    %Spotify.Credentials{access_token: at, refresh_token: rt} =
      creds = Spotify.Credentials.new(conn)

    fields =
      if Map.has_key?(params, "room_code") do
        load_credentials =
          case Map.fetch(params, "listen") do
            {:ok, true} -> true
            _ -> false
          end

        room_code = Map.fetch!(params, "room_code")

        if load_credentials do
          if at == nil do
            redirect(conn, to: "/authorize")
          end

          %{
            has_room_code: true,
            room_code: room_code,
            spotify_refresh_token: rt,
            spotify_access_token: at
          }
        else
          %{has_room_code: true, room_code: room_code}
        end
      else
        %{has_room_code: false}
      end

    render(conn, "index.html", fields)
  end

  def queue(conn, _params) do
    render(conn, "queue.html")
  end

  defp authorize_from_params(_conn, %{"code" => auth_code}) do
    auth_code
  end

  defp authorize_from_params(conn, %{"state" => room_code}) do
    SpotifyController.OAuthController.authorize(conn, room_code)
  end
end
