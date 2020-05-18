export default class PlayerView {
  constructor() {
    this.progressBarElement = document.getElementById("track-progress");
  }
  setTrackPlaybackInfo(startTimestamp, trackLength) {
    this.startTimestamp = startTimestamp;
    this.trackLength = trackLength;
  }
  setPaused(isPaused) {
    this.isPaused = isPaused;
  }
  animate(absTimestamp) {
    if (this.trackLength && !this.isPaused) {
      let ratio = (absTimestamp - this.startTimestamp) / this.trackLength;
      if (ratio > 1) ratio = 1;
      this._setTrackProgress(ratio);
    }
  }
  _setTrackProgress(ratio) {
    this.progressBarElement.style.width = (ratio * 100) + "%";
  }
}