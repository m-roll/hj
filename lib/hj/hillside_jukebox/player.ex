defmodule HillsideJukebox.Player do
  require Logger

  def play(song = %HillsideJukebox.Song{platform: :spotify}) do
    users = HillsideJukebox.Users.get_all()
    Enum.each(users, fn user -> HillsideJukebox.Player.SpotifyPlayer.play_track(user, song) end)
  end
end
