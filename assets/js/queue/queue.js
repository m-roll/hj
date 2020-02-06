let queueDisp = document.getElementById("queue-table");
export function addToQueueDisplay(newEntry) {
    let row = document.createElement("tr");
    let songCol = document.createElement("td");
    let artistCol = document.createElement("td");
    let sourceCol = document.createElement("td");
    let idCol = document.createElement("td");

    songCol.appendChild(document.createTextNode(newEntry.song["track_name"]));
    artistCol.appendChild(document.createTextNode(newEntry.song["track_artist"]));
    sourceCol.appendChild(document.createTextNode(capitalize(newEntry.song["platform"])));
    idCol.appendChild(document.createTextNode(newEntry.song["id"]))

    row.appendChild(songCol);
    row.appendChild(artistCol);
    row.appendChild(sourceCol);
    row.appendChild(idCol);
    queueDisp.appendChild(row);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}