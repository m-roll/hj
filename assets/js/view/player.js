export default function PlayerView() {
  let progressBarElement = document.getElementById("track-progress");
  let isPaused;
  let startTimestamp;
  let trackLength;
  let isEmpty;
  setEmpty();
  
  function updatePlayer(status) {
    progressBarElement.classList.remove('hide');
    let isStarting = !status.paused;
    isPaused = status.paused;
    startTimestamp = +new Date() - status.position;
    trackLength = status.duration;
    isEmpty = false;
  }
  function setEmpty() {
    progressBarElement.classList.add('hide');
  }
  function setTrackPlaybackInfo(startTimestamp, trackLength) {}
  function animate(absTimestamp) {
    if (trackLength && !isPaused) {
      let ratio = (absTimestamp - startTimestamp) / trackLength;
      if (ratio > 1) ratio = 1;
      _setTrackProgress(ratio);
    }
  }
  function _setTrackProgress(ratio) {
    progressBarElement.style.width = (ratio * 100) + "%";
  }

  return {
    updatePlayer,
    setEmpty,
    setTrackPlaybackInfo,
    animate
  }
}