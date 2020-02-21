defmodule HillsideJukebox.Player do
  require Logger

  def play(users, song = %HillsideJukebox.Song{platform: :spotify}) do
    # only need to broadcast to a room
    HjWeb.Endpoint.broadcast!("status", "status:play", song)
    Enum.each(users, fn user -> HillsideJukebox.Player.SpotifyPlayer.play_track(user, song) end)
  end
end
