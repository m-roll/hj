import {
  getArtistString
} from "./util/artist";
export default class StatusView {
  constructor() {
    this.backgroundElem = document.getElementById("background");
    this.trackPlayingName = document.getElementById("status-song-title");
    this.trackPlayingArtist = document.getElementById("status-song-artist");
    this.albumSmall = document.getElementById("preview-image");
  }
  updateStatusView(newEntry) {
    console.log(newEntry)
    this._setTrackName(newEntry.track_name);
    this._setPlayingArtists(newEntry.track_artists);
    this._setTrackArtwork(newEntry.track_art_url)
  }
  _setTrackName(trackName) {
    this.trackPlayingName.textContent = trackName;
  }
  _setPlayingArtists(artists) {
    this.trackPlayingArtist.textContent = getArtistString(artists);
  }
  _setTrackArtwork(artworkUrl) {
    this.backgroundElem.style.backgroundImage = `url(${artworkUrl})`;
    this.albumSmall.style.backgroundImage = `url(${artworkUrl})`;
  }
}