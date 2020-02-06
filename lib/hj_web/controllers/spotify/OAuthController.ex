defmodule SpotifyController.OAuthController do
  use Phoenix.Controller

  def authorize(conn) do
    redirect(conn, external: Spotify.Authorization.url())
  end

  def authenticate(conn, params = %{"code" => code}) do
    auth_result = Spotify.Authentication.authenticate(conn, params)
    # add a user to the pool of players we need to update when they authenticate
    case auth_result do
      {:ok, _} ->
        HillsideJukebox.Users.add(%HillsideJukebox.User{
          authorization_token: code,
          spotify_credentials: Spotify.Credentials.new(conn)
        })
    end

    auth_result
  end
end
