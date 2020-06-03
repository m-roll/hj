defmodule HillsideJukebox.Player.SpotifyPlayer do
  import HillsideJukebox.Auth.Spotify
  require Jason
  require Logger

  def play_track(
        user = %HillsideJukebox.User{id: user_id},
        %HillsideJukebox.Song{platform: :spotify, id: song_id},
        users_pid
      ) do
    %HillsideJukebox.User.State{spotify_credentials: creds} =
      HillsideJukebox.Users.get_state(users_pid, user_id)

    refresh_do(user, &DeSpotify.Player.play/4, [
      generate_body(song_id),
      0,
      %{}
    ])
  end

  def play_track(
        user = %HillsideJukebox.User{id: user_id},
        %HillsideJukebox.Song{platform: :spotify, id: song_id},
        offset_ms,
        users_pid
      ) do
    %HillsideJukebox.User.State{spotify_credentials: creds} =
      HillsideJukebox.Users.get_state(users_pid, user_id)

    refresh_do(user, &DeSpotify.Player.play/4, [
      song_id,
      offset_ms,
      %{}
    ])
  end

  def play_track(user = %HillsideJukebox.User{}) do
    Logger.debug("User is not ready to play but is attempting to anyway. #{inspect(user)}")
  end

  defp generate_body(song_id) do
    body = %{
      uris: ["spotify:track:#{song_id}"]
    }

    Jason.encode!(body)
  end

  defp generate_body(song_id, offset_ms) do
    body = %{
      uris: ["spotify:track:#{song_id}"],
      position_ms: offset_ms
    }

    Jason.encode!(body)
  end
end
