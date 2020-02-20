import { getArtistString } from "./util/artist";

export default class QueueView {
    constructor() {
        this.queueDisp = document.getElementById("queue-table");
    }

    addToQueueDisplay(newEntry) {
        console.log(newEntry.song);
        let capitalize = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        let row = document.createElement("tr");
        let songCol = document.createElement("td");
        let artistCol = document.createElement("td");
        let sourceCol = document.createElement("td");

        songCol.appendChild(document.createTextNode(newEntry.song["track_name"]));
        let artistStr = getArtistString(newEntry.song["track_artists"]);
        artistCol.appendChild(document.createTextNode(artistStr));
        sourceCol.appendChild(document.createTextNode(capitalize(newEntry.song["platform"])));

        row.appendChild(songCol);
        row.appendChild(artistCol);
        row.appendChild(sourceCol);
        this.queueDisp.appendChild(row);
    }
}