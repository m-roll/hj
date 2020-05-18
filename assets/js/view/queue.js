import {
  getArtistString
} from "./util/artist";
export default class QueueView {
  constructor() {
    this.queueDisp = document.getElementById("song-list");
    document.getElementById("queue-skip").addEventListener("click", e => {
      this.onSkipRequestCb();
    });
    let queueHeader = document.getElementById("queue-table-header");
    console.log(queueHeader);
    document.getElementById("queue-peek-btn").addEventListener("click", e => {
      queueHeader.scrollIntoView(true);
    });
  }
  // TODO use JSX
  addToQueueDisplay(newEntry) {
    let capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    let row = document.createElement("tr");
    let songCol = document.createElement("td");
    let artistCol = document.createElement("td");
    let sourceCol = document.createElement("td");
    let durationCol = document.createElement("td");
    songCol.appendChild(document.createTextNode(newEntry.song["track_name"]));
    let artistStr = getArtistString(newEntry.song["track_artists"]);
    artistCol.appendChild(document.createTextNode(artistStr));
    sourceCol.appendChild(document.createTextNode(capitalize(newEntry.song["platform"])));
    let ms = newEntry.song["duration"];
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
    console.log("pop");
    this.queueDisp.removeChild(this.queueDisp.childNodes[2]);
  }
  onSkipRequest(cb) {
    this.onSkipRequestCb = cb;
  }
}