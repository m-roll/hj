defmodule HillsideJukebox.URLsTest do
  use ExUnit.Case
  alias HillsideJukebox.{URLs, Song}

  test "creates song with track id" do
    assert %Song{id: "2zoNNEAyPK2OGDfajardlY", platform: :spotify} ==
             URLs.get_song("spotify:track:2zoNNEAyPK2OGDfajardlY")
  end
end
