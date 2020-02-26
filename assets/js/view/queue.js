import { getArtistString } from "./util/artist";

export default class QueueView {
    constructor() {
        this.queueDisp = document.getElementById("queue-table");
    }

    addToQueueDisplay(newEntry) {
        let capitalize = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        let row = document.createElement("tr");
        let songCol = document.createElement("td");
        let artistCol = document.createElement("td");
        let sourceCol = document.createElement("td");
        let durationCol = document.createElement("td");

        songCol.appendChild(document.createTextNode(newEntry["track_name"]));
        let artistStr = getArtistString(newEntry["track_artists"]);
        artistCol.appendChild(document.createTextNode(artistStr));
        sourceCol.appendChild(document.createTextNode(capitalize(newEntry["platform"])));

        let ms = newEntry["duration"];
        ms = 1000 * Math.round(ms / 1000);
        var d = new Date(ms);
        let secondsStr = d.getUTCSeconds().toString().padStart(2, '0');
        let durText = d.getUTCMinutes() + ':' + secondsStr;
        durationCol.appendChild(document.createTextNode(durText))

        row.appendChild(songCol);
        row.appendChild(artistCol);
        row.appendChild(sourceCol);
        row.appendChild(durationCol);
        this.queueDisp.appendChild(row);
    }

    pop() {
        this.queueDisp.removeChild(this.queueDisp.childNodes[1]);
    }
}