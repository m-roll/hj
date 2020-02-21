defmodule SpotifyController.OAuthController do
  use Phoenix.Controller
  require Logger

  def authorize(conn) do
    redirect(conn, external: Spotify.Authorization.url())
  end

  def authenticate(conn, params = %{"code" => code}) do
    auth_result = Spotify.Authentication.authenticate(conn, params)
    # add a user to the pool of players we need to update when they authenticate
    creds = Spotify.Credentials.new(conn)

    case auth_result do
      {:ok, _} ->
        HillsideJukebox.Users.add_credentials(
          HillsideJukebox.JukeboxServer.get_users_pid("test"),
          Spotify.Credentials.new(conn)
        )
    end

    auth_result
  end
end
