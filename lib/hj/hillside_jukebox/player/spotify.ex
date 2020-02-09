defmodule HillsideJukebox.Player.SpotifyPlayer do
  require Jason
  require Logger

  def play_track(
        %HillsideJukebox.User{spotify_credentials: creds, device_id: device_id},
        %HillsideJukebox.Song{platform: :spotify, id: song_id}
      ) do
    Spotify.Player.play(creds, generate_body(song_id, device_id))
  end

  def play_track(user = %HillsideJukebox.User{}) do
    Logger.debug("User is not ready to play but is attempting to anyway. #{inspect(user)}")
  end

  defp generate_body(song_id, _device_id) do
    body = %{
      uris: ["spotify:track:#{song_id}"]
    }

    Jason.encode!(body)
  end
end
