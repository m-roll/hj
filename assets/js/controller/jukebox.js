import SubmissionView from "../view/submission.js";
import QueueView from "../view/queue.js";
import SpotifyPlayer from "../player/spotify";
import StatusView from "../view/status.js";
import JukeboxSocket from "../socket/socket.js";

export default class JukeboxController {

    queueView;
    statusView = new StatusView();
    submissionView;
    spotifyPlayer;
    socket;
    spotify_access_token;

    constructor() {
        let that = this;
        this.socket = new JukeboxSocket(((payload) => { this.onSongAdded(payload.song) }).bind(this),
            this.onAuthUpdated.bind(this),
            this.onSongPlay.bind(this),
            ["USER", "QUEUE", "STATUS"],
            this.onSongPopped.bind(this)
        );
        this.spotifyPlayer = new SpotifyPlayer(this.init.bind(this), this.onPlayerUpdate.bind(this));
        window.onSpotifyWebPlaybackSDKReady = this.spotifyPlayer.onSpotifyWebPlaybackSDKReady.bind(this.spotifyPlayer);
        this.submissionView = new SubmissionView((url) => {
            //lexical binding - can we get around this?
            this.addSong.apply(that, [url]);
        });
        this.spotify_access_token = hj_spotify_access_token;
        this.socket.fetchQueue();
        this.queueView = new QueueView((e) => {
            this.socket.userChannel.voteSkip();
        });
        this.socket.statusChannel.getCurrent(this.onSongPlay.bind(this));
    }

    onSongAdded(newSong) {
        this.queueView.addToQueueDisplay(newSong);
    }

    onSongPlay(newSong) {
        this.statusView.updateStatusView(newSong);
    }

    addSong(url) {
        this.socket.addSong.apply(this.socket, [this.spotify_access_token, url]);
    }

    onAuthUpdated(auth) {
        this.spotify_access_token = auth;
    }

    init(deviceId) {
        this.socket.registerUser(this.spotify_access_token, deviceId);
        this.socket.fetchQueue(this.onFetchQueue.bind(this));

    }

    onFetchQueue(payload) {
        payload.queue.forEach(song => this.onSongAdded(song))
    }

    onPlayerUpdate(status) {
    }

    onSongPopped(song) {
        this.queueView.pop();
    }
}