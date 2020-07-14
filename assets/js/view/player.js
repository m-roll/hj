export default class PlayerView {
  constructor() {
    this.progressBarElement = document.getElementById("track-progress");
    this.setEmpty();
  }
  updatePlayer(status) {
    this.progressBarElement.classList.remove('hide');
    let isStarting = !status.paused;
    this.isPaused = status.paused;
    this.startTimestamp = +new Date() - status.position;
    this.trackLength = status.duration;
    this.isEmpty = false;
  }
  setEmpty() {
    this.progressBarElement.classList.add('hide');
  }
  setTrackPlaybackInfo(startTimestamp, trackLength) {}
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