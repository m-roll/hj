defmodule HillsideJukebox.Player do
  def play(song = %HillsideJukebox.Song{}) do
    users = HillsideJukebox.Users.get_all()
    Enum.map(users, fn user -> HillsideJukebox.Player.Spotify.play_track(user, song) end)
  end
end
