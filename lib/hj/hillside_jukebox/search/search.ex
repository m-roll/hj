defmodule HillsideJukebox.Search do
  @search_limit 10
  @search_types [:track]
  def song(query) when is_binary(query) do
    {:ok, %{"tracks" => %DeSpotify.Paging{items: results}}} =
      HillsideJukebox.Auth.Spotify.call_for_client(
        &DeSpotify.Search.search/4,
        [query, @search_types, %{limit: @search_limit}]
      )

    Enum.map(results, fn spotify_track -> HillsideJukebox.Song.from(spotify_track, :thumb) end)
  end
end
