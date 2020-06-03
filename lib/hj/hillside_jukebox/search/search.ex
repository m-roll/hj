defmodule HillsideJukebox.Search do
  @search_limit 10
  @search_types [:track]
  def song(room_code, query) when is_binary(query) do
    users_pid = HillsideJukebox.JukeboxServer.get_users_pid(room_code)

    {user, _} = HillsideJukebox.Users.get_host(users_pid)

    {:ok, %{"tracks" => %DeSpotify.Paging{items: results}}} =
      HillsideJukebox.Auth.Spotify.refresh_do(
        user,
        &DeSpotify.Search.search/4,
        [query, @search_types, %{limit: @search_limit}]
      )

    Enum.map(results, fn spotify_track -> HillsideJukebox.Song.from(spotify_track, :thumb) end)
  end
end
