defmodule HillsideJukebox.URLs do
  import URI
  import HillsideJukebox
  import HillsideJukebox.Auth.Spotify
  require Logger

  ## Failure case: this will fail if the given URL does not match to a platform

  ## Need some credentials to get the full details of the song
  def get_song("spotify:track:" <> track_id, creds = %Spotify.Credentials{}, users_pid, user_id) do
    {:ok, spotify_track} =
      refresh_do(users_pid, user_id, creds, &Spotify.Track.get_track/2, [track_id])

    HillsideJukebox.Song.from(spotify_track)
  end
end
