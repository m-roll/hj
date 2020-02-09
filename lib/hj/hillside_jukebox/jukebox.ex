defmodule HillsideJukebox.Jukebox do
  require Logger
  ## This is the outer part of the API. This is what the web client will interact with

  def add_to_queue(url) do
    song = HillsideJukebox.URLs.get_song(url)

    if HillsideJukebox.SongQueue.Server.is_empty() do
      HillsideJukebox.SongQueue.Server.add(song)
      next_song = HillsideJukebox.SongQueue.Server.next()
      HillsideJukebox.Player.play(next_song)
    else
      HillsideJukebox.SongQueue.Server.add(song)
    end

    song
  end

  def get_current_song do
  end

  def next_song do
  end
end
