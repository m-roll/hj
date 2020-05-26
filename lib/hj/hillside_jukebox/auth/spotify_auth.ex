defmodule HillsideJukebox.Auth.Spotify do
  @expired {:ok, %{"error" => %{"status" => 401}}}

  # When choosing arity to pass in, use the arity + 1. The creds will be appended to the first
  def refresh_do(users_pid, user_id, creds = %DeSpotify.Auth.Tokens{}, fun, args) do
    res = apply(fun, [creds | args])

    case res do
      @expired ->
        {:ok, new_creds = %DeSpotify.Auth.Tokens{}} = Spotify.Authentication.refresh(creds)
        update_creds(users_pid, user_id, new_creds)
        apply(fun, [new_creds | args])

      _ ->
        res
    end
  end

  defp update_creds(users_pid, user_id, new_creds) do
    user_state = HillsideJukebox.Users.get_state(users_pid, user_id)

    HillsideJukebox.Users.set_state(users_pid, user_id, %{
      user_state
      | spotify_credentials: new_creds
    })
  end
end
