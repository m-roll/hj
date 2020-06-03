defmodule HillsideJukebox.Auth.Spotify do
  @expired {:ok, %{"error" => %{"status" => 401}}}

  # When choosing arity to pass in, use the arity + 1. The creds will be appended to the first
  def refresh_do(
        user = %HillsideJukebox.User{access_token: access_token},
        fun,
        args
      ) do
    res = apply(fun, [access_token | args])

    case res do
      @expired ->
        {:ok, new_access_token} = DeSpotify.Authentication.refresh(access_token)
        HillsideJukebox.Accounts.update_access_token(user, new_access_token)
        apply(fun, [new_access_token | args])

      _ ->
        res
    end
  end
end
