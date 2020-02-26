defmodule HillsideJukebox.Player do
  require Logger

  def play(users, song = %HillsideJukebox.Song{platform: :spotify}) do
    # TODO only need to broadcast to a room
    HjWeb.Endpoint.broadcast!("status", "status:play", song)
    # TODO spawn a bunch of tasks that do this in parallel. A lot of users slows this down and
    # gets audio out of sync.
    Enum.each(users, fn user -> HillsideJukebox.Player.SpotifyPlayer.play_track(user, song) end)
  end

  def play_at_for_user(user, song, offset_ms) do
    HillsideJukebox.Player.SpotifyPlayer.play_track(user, song, offset_ms)
  end
end
