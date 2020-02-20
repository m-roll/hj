defmodule HillsideJukebox.Song do
  @derive {Jason.Encoder, only: [:id, :platform, :track_name, :track_artists, :track_art_url]}
  defstruct id: nil,
            platform: nil,
            track_name: "Untitled",
            track_artists: ["Unknown"],
            track_art_url: ""
end
