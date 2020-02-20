import { getArtistString } from "./util/artist";

export default class StatusView {
    constructor() {
        this.backgroundElem = document.getElementById("background");
        this.trackPlayingName = document.getElementById("status-song-title");
        this.trackPlayingArtist = document.getElementById("status-song-artist");
    }

    updateStatusView(newEntry) {
        this.backgroundElem.style.backgroundImage = "url(" + newEntry.song["track_art_url"] + ")";
        this.trackPlayingName.textContent = newEntry.song["track_name"];
        this.trackPlayingArtist.textContent = getArtistString(newEntry.song["track_artists"]);
    }
}