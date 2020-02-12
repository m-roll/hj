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
import SubmissionView from "./view/submission.js";
import QueueView from "./view/queue.js";
import SpotifyPlayer from "./player/spotify";

let socket = new Socket("/socket", { params: { token: window.userToken } })
socket.connect();

let queueView = new QueueView();

let queueChannel = new QueueChannel(socket, queueView.addToQueueDisplay.bind(queueView));
queueChannel.join();

let userChannel = new UserChannel(socket, (auth) => hj_spotify_access_token = auth);
userChannel.join();

let spotifyPlayer = new SpotifyPlayer((deviceId) =>
    userChannel.register(hj_spotify_access_token, deviceId)
);

window.onSpotifyWebPlaybackSDKReady = spotifyPlayer.onSpotifyWebPlaybackSDKReady.bind(spotifyPlayer);

let submissionView = new SubmissionView((url) => queueChannel.add_song(hj_spotify_access_token, url));

export default socket
