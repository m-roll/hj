defmodule HillsideJukebox.Song do
  @derive {Jason.Encoder,
           only: [:id, :platform, :track_name, :track_artists, :track_art_url, :duration]}
  defstruct id: nil,
            platform: nil,
            track_name: "Untitled",
            track_artists: ["Unknown"],
            track_art_url: "",
            duration: nil

  def from(
        %DeSpotify.Track{
          id: track_id,
          name: name,
          duration_ms: duration,
          artists: artists,
          album: %DeSpotify.SimplifiedAlbum{images: images}
        },
        image_size
      ) do
    %DeSpotify.Image{url: art_url} =
      case image_size do
        :largest -> List.first(images)
        :thumb -> List.last(images)
      end

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
    Enum.map(artists, fn %DeSpotify.SimplifiedArtist{name: name} -> name end)
  end
end
