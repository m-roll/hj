defmodule HillsideJukebox.Users.Authentication do
  def refresh_user_credentials(
        users_pid,
        user = %HillsideJukebox.User{spotify_credentials: creds, user_id: user_id},
        callback
      ) do
    {:ok, creds_new} = Spotify.Authentication.refresh(creds)
    # TODO only need to broadcast to a room
    new_user = %{user | spotify_credentials: creds_new}
    HillsideJukebox.Users.update_with_id(users_pid, user_id, new_user)
    callback.(new_user)
  end
end
