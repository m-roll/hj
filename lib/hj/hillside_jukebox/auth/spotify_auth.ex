defmodule HillsideJukebox.Auth.Spotify do
  # When choosing arity to pass in, use the arity + 1. The creds will be appended to the first
  def refresh_do(
        user = %HillsideJukebox.User{access_token: access_token, refresh_token: refresh_token},
        fun,
        args
      ) do
    res = apply(fun, [access_token | args])

    case res do
      {:error, %DeSpotify.Error{status: 401}} ->
        {:ok, %{"access_token" => new_access_token}} = DeSpotify.Auth.refresh(refresh_token)
        HillsideJukebox.Accounts.update_access_token(user, new_access_token)
        apply(fun, [new_access_token | args])

      _ ->
        res
    end
  end
end
