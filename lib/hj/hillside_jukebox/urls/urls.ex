defmodule HillsideJukebox.URLs do
  import URI
  import HillsideJukebox

  ## Failure case: this will fail if the given URL does not match to a platform

  def get_song("spotify:track:" <> track_id) do
    %HillsideJukebox.Song{id: track_id, platform: :spotify}
  end

  def get_song("spotify:track:" <> track_id, creds = %Spotify.Credentials{}) do
    {:ok, %Spotify.Track{name: name, artists: artists}} = Spotify.Track.get_track(creds, track_id)

    %HillsideJukebox.Song{
      id: track_id,
      platform: :spotify,
      track_name: name,
      track_artists: spotify_get_artists_names(artists)
    }
  end

  def get_platform(uri) do
    uri
    |> decode
    |> parse
    |> platform_from_host
  end

  defp platform_from_host(%URI{host: "www.soundcloud.com"}) do
    :soundcloud
  end

  defp platform_from_host(%URI{host: "www.spotify.com"}) do
    :spotify
  end

  defp spotify_get_artists_names(artists) do
    Enum.map(artists, fn %{"name" => name} -> name end)
  end
end