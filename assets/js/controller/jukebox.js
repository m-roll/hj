import SubmissionView from "../view/submission.js";
import QueueView from "../view/queue.js";
import SpotifyPlayer from "../player/spotify";
import StatusView from "../view/status.js";
import JukeboxSocket from "../socket/socket.js";
import PlayerView from "../view/player.js";

export default class JukeboxController {

    queueView;
    statusView = new StatusView();
    playerView = new PlayerView();
    submissionView;
    spotifyPlayer;
    socket;
    spotify_access_token;
    songPlayedTime;
    currentSongLength;
    animationStartTimestamp;
    isPaused = true;

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
        this.animationStartTimestamp = + new Date()
        requestAnimationFrame(this.animate.bind(this));
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
        console.log(status);
        let isStarting = !status.paused;
        if (status.paused) {
            this.isPaused = true;
        } else {
            this.isPaused = false;
            this.songPlayedTime = + new Date() - status.position;
            this.currentSongLength = status.duration;
        }
    }

    onSongPopped(song) {
        this.queueView.pop();
    }

    animate(timestamp) {
        let absTimestamp = this.animationStartTimestamp + timestamp;
        if (this.songPlayedTime && !this.isPaused) {
            let ratio = (absTimestamp - this.songPlayedTime) / this.currentSongLength;
            if (ratio > 1) ratio = 1;
            this.playerView.setTrackProgress(ratio);
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}