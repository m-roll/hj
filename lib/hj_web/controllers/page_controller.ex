defmodule HjWeb.PageController do
  require Logger
  import Plug.Conn
  use HjWeb, :controller

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
    redirect(conn, to: "/room/#{new_code}/listen")
  end

  def listen(conn, params) do
    jukebox(conn, Map.put(params, "listen", true))
  end

  def jukebox(conn, params) do
    fields =
      if Map.has_key?(params, "room_code") do
        load_credentials =
          case Map.fetch(params, "listen") do
            {:ok, true} -> true
            _ -> false
          end

        room_code = Map.fetch!(params, "room_code")

        if load_credentials do
          resource_token = Guardian.Plug.current_token(conn)

          user =
            %HillsideJukebox.User{access_token: access_token} =
            Guardian.Plug.current_resource(conn)

          if resource_token == nil do
            redirect(conn, to: "/authorize")
          end

          %{
            has_room_code: true,
            room_code: room_code,
            has_credentials: true,
            hj_resource_token: resource_token,
            spotify_access_token: access_token
          }
        else
          %{has_room_code: true, room_code: room_code, has_credentials: false}
        end
      else
        %{has_room_code: false, has_credentials: false}
      end

    render(conn, "index.html", fields)
  end

  def queue(conn, _params) do
    render(conn, "queue.html")
  end
end
