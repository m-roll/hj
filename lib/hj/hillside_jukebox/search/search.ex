defmodule HillsideJukebox.Search do
  @search_limit 10
  @search_types "track"
  def song(room_code, query) when is_binary(query) do
    users_pid = HillsideJukebox.JukeboxServer.get_users_pid(room_code)

    {%HillsideJukebox.User{user_id: host_id},
     %HillsideJukebox.User.State{spotify_credentials: host_creds}} =
      HillsideJukebox.Users.get_host(users_pid)

    {:ok, %Spotify.Paging{items: results}} =
      HillsideJukebox.Auth.Spotify.refresh_do(
        users_pid,
        host_id,
        host_creds,
        &Spotify.Search.query/2,
        [%{type: @search_types, limit: @search_limit, q: query}]
      )

    Enum.map(results, fn spotify_track -> HillsideJukebox.Song.from(spotify_track, :thumb) end)
  end
end
