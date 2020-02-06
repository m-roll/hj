defmodule HillsideJukebox.Song do
  @derive {Jason.Encoder, only: [:id, :platform, :track_name, :track_artist]}
  defstruct id: nil,
            platform: nil,
            track_name: "Untitled",
            track_artist: "Unknown"
end
