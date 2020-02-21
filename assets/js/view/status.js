import { getArtistString } from "./util/artist";

export default class StatusView {
    constructor() {
        this.backgroundElem = document.getElementById("background");
        this.trackPlayingName = document.getElementById("status-song-title");
        this.trackPlayingArtist = document.getElementById("status-song-artist");
        this.albumSmall = document.getElementById("preview-image");
    }

    updateStatusView(newEntry) {
        let imageBg = "url(" + newEntry["track_art_url"] + ")";
        this.backgroundElem.style.backgroundImage = imageBg;
        this.albumSmall.style.backgroundImage = imageBg;
        this.trackPlayingName.textContent = newEntry["track_name"];
        this.trackPlayingArtist.textContent = getArtistString(newEntry["track_artists"]);
    }
}