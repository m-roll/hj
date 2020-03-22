export default class PlayerView {
    constructor() {
        this.progressBarElement = document.getElementById("track-progress");
    }

    setTrackProgress(ratio) {
        this.progressBarElement.style.width = (ratio * 100) + "%";
    }
}