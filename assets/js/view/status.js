import {
  getArtistString
} from "./util/artist";
import $ from "jquery";
import StatusEmptyView from "./status-empty";
export default class StatusView {
  constructor(playerView) {
    this.backgroundElem = document.getElementById("background");
    this.trackPlayingName = document.getElementById("status-song-title");
    this.trackPlayingArtist = document.getElementById("status-song-artist");
    this.albumSmall = document.getElementById("preview-image");
    this.playerView = playerView;
    this.statusEmptyView = new StatusEmptyView();
  }
  updateStatusView(songData) {
    if (songData.song === "empty") {
      this.statusEmptyView.show();
    } else {
      this.statusEmptyView.hide();
      let newEntry = songData.song;
      let playbackPos = songData.playback_pos;
      this.playerView.updatePlayer({
        paused: false,
        position: playbackPos,
        duration: newEntry.duration
      });
      this._setTrackName(newEntry.track_name);
      this._setPlayingArtists(newEntry.track_artists);
      this._setTrackArtwork(newEntry.track_art_url);
    }
  }
  setEmpty() {
    this._setTrackArtwork('');
    this._setTrackName('');
    this._setPlayingArtistString()
    this.statusEmptyView.show();
    this.trackPlayingName.classList.add("blank");
    this.trackPlayingArtist.classList.add("blank");
    console.log("empty")
    this.playerView.setEmpty();
  }
  _setTrackName(trackName) {
    this.trackPlayingName.textContent = trackName;
    this.trackPlayingName.classList.remove("blank");
  }
  _setPlayingArtists(artists) {
    if (artists) {
      this._setPlayingArtistString(getArtistString(artists));
    }
  }
  _setPlayingArtistString(text) {
    this.trackPlayingArtist.textContent = text;
    this.trackPlayingArtist.classList.remove("blank");
  }
  _setTrackArtwork(artworkUrl) {
    this.backgroundElem.style.backgroundImage = `url(${artworkUrl})`;
    this.albumSmall.style.backgroundImage = `url(${artworkUrl})`;
  }
}