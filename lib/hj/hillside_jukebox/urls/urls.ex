defmodule HillsideJukebox.URLs do
  import URI
  import HillsideJukebox

  ## Failure case: this will fail if the given URL does not match to a platform

  def get_song("spotify:track:" <> track_id) do
    %HillsideJukebox.Song{id: track_id, platform: :spotify}
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
end
