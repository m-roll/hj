defmodule HillsideJukebox.Player.SpotifyPlayer do
  import HillsideJukebox.Auth.Spotify
  require Jason
  require Logger

  def play_track(
        user = %HillsideJukebox.User{id: user_id},
        song
      ) do
    play_track(user, song, 0)
  end

  def play_track(
        user = %HillsideJukebox.User{id: user_id},
        %HillsideJukebox.Song{platform: :spotify, id: song_id},
        offset_ms
      ) do
    body_params = %{"uris" => ["spotify:track:" <> song_id], "position_ms" => offset_ms}

    {:ok, :no_content} =
      call_for_user(user, &DeSpotify.Player.play/3, [
        body_params,
        %{}
      ])
  end

  def play_track(user = %HillsideJukebox.User{}) do
    Logger.debug("User is not ready to play but is attempting to anyway. #{inspect(user)}")
  end

  def pause_track(user) do
    {:ok, :no_content} = call_for_user(user, &DeSpotify.Player.pause_playback/2, [%{}])
  end
end
