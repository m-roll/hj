defmodule SpotifyController.OAuthController do
  use Phoenix.Controller
  alias HillsideJukebox.Auth.{UserSession}
  require Logger

  alias HillsideJukebox.Accounts

  def authorize(conn, params) do
    {:ok, session_opts = %{url: redirect_url, session_params: %{state: state_nonce}}} =
      DeSpotify.Auth.authorize_url()

    conn_with_query_params = Plug.Conn.fetch_query_params(conn)

    Logger.debug("Conn with query params: #{inspect(conn_with_query_params)}")

    session_opts =
      case conn_with_query_params do
        %{room_code: room_code} -> Map.put(session_opts, :room_code, room_code)
        _ -> session_opts
      end

    # prevents atom DoS attack when popping state.
    other_params =
      case params do
        %{"room_code" => room_code} -> %{room_code: room_code}
        _ -> %{}
      end

    UserSession.save_state(state_nonce, Map.merge(session_opts, other_params))
    redirect(conn, external: redirect_url)
  end

  def authenticate(conn, params = %{"state" => state_nonce}) do
    # add a user to the pool of players we need to update when they authenticate
    {:ok, session_opts} = UserSession.pop_state(state_nonce)

    Logger.debug("Session opts: #{inspect(session_opts)}")

    {:ok, %{token: tokens = %DeSpotify.Auth.Tokens{access_token: at, refresh_token: _rt}}} =
      DeSpotify.Auth.callback(params, Map.to_list(session_opts))

    {:ok, spotify_user} = DeSpotify.Users.get_user(at)

    if spotify_user.product != "premium" do
      {conn, "/not-premium"}
    else
      {:ok, user} = Accounts.register_or_update_auth(tokens, spotify_user)

      redirect_url =
        case session_opts do
          %{room_code: room_code} -> "/room/#{room_code}/listen"
          _ -> "/"
        end

      {HjWeb.Guardian.Plug.sign_in(conn, user), redirect_url}
    end
  end
end
