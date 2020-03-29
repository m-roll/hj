defmodule SpotifyController.OAuthController do
  use Phoenix.Controller
  require Logger

  def authorize(conn, room_code) do
    redirect(conn, external: Spotify.Authorization.url() <> "&state=" <> room_code)
  end

  def authenticate(conn, params = %{"code" => code}) do
    auth_result = Spotify.Authentication.authenticate(conn, params)
    # add a user to the pool of players we need to update when they authenticate
    creds = Spotify.Credentials.new(conn)

    auth_result
  end
end
