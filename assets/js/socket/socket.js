// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".
// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {
  Socket,
  Channel
} from "phoenix";
import QueueChannel from "./channels/queue.js";
import UserChannel from "./channels/user.js";
import StatusChannel from "./channels/status.js";
export default class JukeboxSocket {
  socket = new Socket("/socket", {
    params: {
      token: window.userToken
    }
  })
  queueChannel;
  userChannel;
  constructor() {
    this.socket.connect();
  }
  joinChannel(channel, ...args) {
    let newChannel = new channel(this.socket, ...args);
    newChannel.join();
    return newChannel;
  }
}