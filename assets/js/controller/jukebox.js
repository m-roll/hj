import SubmissionView from "../view/submission.js";
import QueueView from "../view/queue.js";
import SpotifyPlayer from "../player/spotify";
import StatusView from "../view/status.js";
import JukeboxSocket from "../socket/socket.js";

export default class JukeboxController {

    queueView = new QueueView();
    statusView = new StatusView();
    submissionView;
    spotifyPlayer;
    socket;
    spotify_access_token;

    constructor() {
        let that = this;
        this.socket = new JukeboxSocket(this.onSongAdded.bind(this), this.onAuthUpdated.bind(this), ["USER", "QUEUE"]);
        this.spotifyPlayer = new SpotifyPlayer(this.registerUser.bind(this), this.onPlayerUpdate.bind(this));
        window.onSpotifyWebPlaybackSDKReady = this.spotifyPlayer.onSpotifyWebPlaybackSDKReady.bind(this.spotifyPlayer);
        this.submissionView = new SubmissionView((url) => {
            //lexical binding - can we get around this?
            this.addSong.apply(that, [url]);
        });
        this.spotify_access_token = hj_spotify_access_token;
    }

    onSongAdded(newSong) {
        this.queueView.addToQueueDisplay(newSong);
        this.statusView.updateStatusView(newSong);
    }

    addSong(url) {
        this.socket.addSong.apply(this.socket, [this.spotify_access_token, url]);
    }

    onAuthUpdated(auth) {
        this.spotify_access_token = auth;
    }

    registerUser(deviceId) {
        this.socket.registerUser(this.spotify_access_token, deviceId)
    }

    onPlayerUpdate(status) {
        console.log(status);
    }
}