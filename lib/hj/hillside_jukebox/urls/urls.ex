defmodule HillsideJukebox.URLs do
  import URI
  import HillsideJukebox
  import HillsideJukebox.Auth.Spotify
  require Logger

  ## Failure case: this will fail if the given URL does not match to a platform

  ## Need some credentials to get the full details of the song
  def get_song("spotify:track:" <> track_id, creds = %Spotify.Credentials{}, users_pid, user_id) do
    {:ok,
     %Spotify.Track{
       name: name,
       duration_ms: duration,
       artists: artists,
       album: %{"images" => [largest | _rest]}
     }} = refresh_do(users_pid, user_id, creds, &Spotify.Track.get_track/2, [track_id])

    %{"url" => art_url} = largest

    %HillsideJukebox.Song{
      id: track_id,
      platform: :spotify,
      track_name: name,
      track_artists: spotify_get_artists_names(artists),
      track_art_url: art_url,
      duration: duration
    }
  end

  defp spotify_get_artists_names(artists) do
    Enum.map(artists, fn %{"name" => name} -> name end)
  end
end
