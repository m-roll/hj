defmodule HillsideJukebox.Player do
  require Logger

  def play(users_pid, song = %HillsideJukebox.Song{platform: :spotify}) do
    # TODO only need to broadcast to a room
    HjWeb.Endpoint.broadcast!("status", "status:play", song)
    # TODO spawn a bunch of tasks that do this in parallel. A lot of users slows this down and
    # gets audio out of sync.
    users = HillsideJukebox.Users.get_all(users_pid)

    Enum.each(users, fn {user, _state} ->
      play_at_for_user(users_pid, user, song, 0)
    end)
  end

  def play_at_for_user(users_pid, user, song, offset_ms) do
    Logger.debug("Playing for user: #{inspect(user)}")
    HillsideJukebox.Player.SpotifyPlayer.play_track(user, song, offset_ms, users_pid)
  end
end
