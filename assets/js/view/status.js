import {
  getArtistString
} from "./util/artist";
import $ from "jquery";
import StatusEmptyView from "./status-empty";
export default function StatusView(playerView) {
  let backgroundElem = document.getElementById("background");
  let trackPlayingName = document.getElementById("status-song-title");
  let trackPlayingArtist = document.getElementById("status-song-artist");
  let albumSmall = document.getElementById("preview-image");
  let statusEmptyView = new StatusEmptyView();

  function updateStatusView(songData) {
    if (songData.song === "empty") {
      statusEmptyView.show();
    } else {
      statusEmptyView.hide();
      let newEntry = songData.song;
      let playbackPos = songData.playback_pos;
      playerView.updatePlayer({
        paused: false,
        position: playbackPos,
        duration: newEntry.duration
      });
      _setTrackName(newEntry.track_name);
      _setPlayingArtists(newEntry.track_artists);
      _setTrackArtwork(newEntry.track_art_url);
    }
  }
  function setEmpty() {
    _setTrackArtwork('');
    _setTrackName('');
    _setPlayingArtistString()
    statusEmptyView.show();
    trackPlayingName.classList.add("blank");
    trackPlayingArtist.classList.add("blank");
    playerView.setEmpty();
  }
  function _setTrackName(trackName) {
    trackPlayingName.textContent = trackName;
    trackPlayingName.classList.remove("blank");
  }
  function _setPlayingArtists(artists) {
    if (artists) {
      _setPlayingArtistString(getArtistString(artists));
    }
  }
  function _setPlayingArtistString(text) {
    trackPlayingArtist.textContent = text;
    trackPlayingArtist.classList.remove("blank");
  }
  function _setTrackArtwork(artworkUrl) {
    backgroundElem.style.backgroundImage = `url(${artworkUrl})`;
    albumSmall.style.backgroundImage = `url(${artworkUrl})`;
  }

  return {
    updateStatusView,
    setEmpty
  }
}