// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import { Socket } from "phoenix";
import { addToQueueDisplay } from "./queue/queue.js";

let socket = new Socket("/socket", { params: { token: window.userToken } })
socket.connect()

let channel = socket.channel("queue", {})
let songInput = document.getElementById("song-input");
let submitBtn = document.getElementById("submit-button");
submitBtn.addEventListener("click", e => {
  channel.push('song:add', {
    songInput: songInput.value,
    user: "Anonymous user"
  });
  songInput.value = "";
});

channel.on('song:processed', payload => {
  addToQueueDisplay(payload);
})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket
