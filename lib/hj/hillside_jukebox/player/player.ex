defmodule HillsideJukebox.Player do
  require Logger

  def play(users_pid, room_code, song = %HillsideJukebox.Song{platform: :spotify}) do
    HjWeb.Endpoint.broadcast!("status:" <> room_code, "status:play", %{
      song: song,
      playback_pos: 0
    })

    users = HillsideJukebox.UserPool.get_all(users_pid)
    Logger.debug("All users: #{inspect(users)}")

    Enum.each(
      users,
      fn user ->
        Task.start(fn ->
          play_at_for_user(user, song, 0)
        end)
      end
    )
  end

  def pause(users_pid, room_code) do
    users = HillsideJukebox.UserPool.get_all(users_pid)

    Enum.each(users, fn user ->
      Task.start(fn ->
        HillsideJukebox.Player.SpotifyPlayer.pause_track(user)
      end)
    end)
  end

  def stop_playback_for_user(user) do
    HillsideJukebox.Player.SpotifyPlayer.pause_track(user)
  end

  def play_at_for_user(user, song, offset_ms) do
    HillsideJukebox.Player.SpotifyPlayer.play_track(user, song, offset_ms)
  end
end
