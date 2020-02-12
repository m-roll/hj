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
        let idCol = document.createElement("td");

        songCol.appendChild(document.createTextNode(newEntry.song["track_name"]));
        artistCol.appendChild(document.createTextNode(newEntry.song["track_artist"]));
        console.log(newEntry);
        sourceCol.appendChild(document.createTextNode(capitalize(newEntry.song["platform"])));
        idCol.appendChild(document.createTextNode(newEntry.song["id"]))

        row.appendChild(songCol);
        row.appendChild(artistCol);
        row.appendChild(sourceCol);
        row.appendChild(idCol);
        this.queueDisp.appendChild(row);
    }
}