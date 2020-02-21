// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import { Socket } from "phoenix";
import QueueChannel from "./channels/queue.js";
import UserChannel from "./channels/user.js";
import StatusChannel from "./channels/status.js";

export default class JukeboxSocket {
    socket = new Socket("/socket", { params: { token: window.userToken } })
    queueChannel; userChannel;
    constructor(songAddedCb, authUpdateCb, songPlayCb, channels) {
        this.socket.connect();
        this.queueChannel = new QueueChannel(this.socket, songAddedCb);
        this.userChannel = new UserChannel(this.socket, authUpdateCb);
        this.statusChannel = new StatusChannel(this.socket, songPlayCb);
        if (channels.includes("USER")) {
            this.userChannel.join();
        }
        if (channels.includes("QUEUE")) {
            this.queueChannel.join();
        }
        if (channels.includes("STATUS")) {
            this.statusChannel.join();
        }
    }

    registerUser(accessToken, deviceId) {
        this.userChannel.register(accessToken, deviceId)
    }

    addSong(accessToken, url) {
        this.queueChannel.addSong(accessToken, url);
    }
}