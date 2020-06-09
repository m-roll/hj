import {
  getArtistString
} from "./util/artist";
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
      this._setTrackArtwork(newEntry.track_art_url)
    }
  }
  _setTrackName(trackName) {
    this.trackPlayingName.textContent = trackName;
  }
  _setPlayingArtists(artists) {
    if (artists) {
      this.trackPlayingArtist.textContent = getArtistString(artists);
    }
  }
  _setTrackArtwork(artworkUrl) {
    this.backgroundElem.style.backgroundImage = `url(${artworkUrl})`;
    this.albumSmall.style.backgroundImage = `url(${artworkUrl})`;
  }
}