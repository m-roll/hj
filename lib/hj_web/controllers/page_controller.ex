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
      %{}
      |> Map.merge(handle_room_fields(conn, params))
      |> Map.merge(handle_user_fields(conn, params))
      |> Map.merge(handle_meta_fields(conn, params))

    render(conn, "index.html", fields)
  end

  defp handle_room_fields(_conn, params) do
    fields = %{}

    case Map.fetch(params, "room_code") do
      {:ok, room_code} -> %{has_room_code: true, room_code: room_code}
      _ -> %{has_room_code: false}
    end
  end

  defp handle_user_fields(conn, params) do
    case Guardian.Plug.current_token(conn) do
      nil ->
        %{has_credentials: false}

      resource_token ->
        %{has_credentials: true, hj_resource_token: resource_token, spotify_access_token: nil}
    end
  end

  defp handle_meta_fields(conn, params) do
    case Map.fetch(params, "listen") do
      {:ok, true} -> %{hj_listening: true}
      _ -> %{hj_listening: false}
    end
  end

  def queue(conn, _params) do
    render(conn, "queue.html")
  end
end
