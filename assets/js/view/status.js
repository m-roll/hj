export default class StatusView {
    constructor() {
        this.backgroundElem = document.getElementById("background");
    }

    updateStatusView(newSong) {
        this.backgroundElem.style.backgroundImage = "url(" + newSong.song["track_art_url"] + ")";
        console.log(newSong);
        console.log(this.backgroundElem);
    }
}