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
import SubmissionView from "./view/submission.js";
import QueueView from "./view/queue.js";
import SpotifyPlayer from "./player/spotify";
import StatusView from "./view/status.js";

let socket = new Socket("/socket", { params: { token: window.userToken } })
socket.connect();

let queueView = new QueueView();
let statusView = new StatusView();

let queueChannel = new QueueChannel(socket, (newSong) => {
    queueView.addToQueueDisplay(newSong);
});

let userChannel = new UserChannel(socket, (auth) => hj_spotify_access_token = auth);

let statusChannel = new StatusChannel(socket, (songPlayed) => {
    statusView.updateStatusView(songPlayed);
});

userChannel.join();
queueChannel.join();
statusChannel.join();

let spotifyPlayer = new SpotifyPlayer((deviceId) =>
    userChannel.register(hj_spotify_access_token, deviceId)
);

window.onSpotifyWebPlaybackSDKReady = spotifyPlayer.onSpotifyWebPlaybackSDKReady.bind(spotifyPlayer);

let submissionView = new SubmissionView((url) => queueChannel.add_song(hj_spotify_access_token, url));

export default socket
