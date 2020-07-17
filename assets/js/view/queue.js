import {
  getArtistString
} from "./util/artist";
export default function QueueView() {
  let queueDisp = document.getElementById("song-list");
  let queueHeader = document.getElementById("queue-table-header");
  document.getElementById("queue-peek-btn").addEventListener("click", e => {
    queueHeader.scrollIntoView(true);
  });

  // TODO use JSX
  function addToQueueDisplay(newEntry) {
    let capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    let row = document.createElement("tr");
    let songCol = document.createElement("td");
    let artistCol = document.createElement("td");
    let nicknameCol = document.createElement("td");
    let durationCol = document.createElement("td");
    songCol.appendChild(document.createTextNode(newEntry.song["track_name"]));
    let artistStr = getArtistString(newEntry.song["track_artists"]);
    artistCol.appendChild(document.createTextNode(artistStr));
    nicknameCol.appendChild(document.createTextNode(newEntry.song["submitter"]));
    let ms = newEntry.song["duration"];
    ms = 1000 * Math.round(ms / 1000);
    var d = new Date(ms);
    let secondsStr = d.getUTCSeconds().toString().padStart(2, '0');
    let durText = d.getUTCMinutes() + ':' + secondsStr;
    durationCol.appendChild(document.createTextNode(durText))
    row.appendChild(songCol);
    row.appendChild(artistCol);
    row.appendChild(nicknameCol);
    row.appendChild(durationCol);
    queueDisp.appendChild(row);
  }
  function pop() {
    queueDisp.removeChild(queueDisp.childNodes[2]);
  }

  return {
    addToQueueDisplay,
    pop
  }
}