defmodule HillsideJukebox.Jukebox do
  ## This is the outer part of the API. This is what the web client will interact with

  def add_to_queue(url) do
    HillsideJukebox.SongQueue.Server.add(HillsideJukebox.URLs.get_song(url))

    if HillsideJukebox.SongQueue.Server.is_empty() do
      next_song = HillsideJukebox.SongQueue.Server.next()
      HillsideJukebox.Player.play(next_song)
    end
  end

  def get_current_song do
  end

  def next_song do
  end
end
