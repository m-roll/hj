import SubmissionView from "../view/submission.js";
import QueueView from "../view/queue.js";
import SpotifyPlayer from "../player/spotify";
import StatusView from "../view/status.js";
import JukeboxSocket from "../socket/socket.js";
import QueueChannel from "../socket/channels/queue.js";
import UserChannel from "../socket/channels/user.js";
import StatusChannel from "../socket/channels/status.js";
import PlayerView from "../view/player.js";
import EnterModal from "../view/enter-modal.js";

export default class JukeboxController {

    queueView;
    statusView = new StatusView();
    playerView = new PlayerView();
    enterModal = new EnterModal();
    submissionView;
    spotifyPlayer;
    socket = new JukeboxSocket();
    spotify_access_token;
    songPlayedTime;
    currentSongLength;
    animationStartTimestamp;
    isPaused = true;
    roomCode;

    onSongPlayed = song => this.queueView.addToQueueDisplay(payload.newSong).bind(this);

    channels = {
        queue: null,
        user: null,
        status: null
    }

    constructor() {
        this.setupView();

        if (typeof room_code !== 'undefined') {
            this.setupRoom(room_code);
        }
        this.setupModal();
        this.setupAnimation();
    }

    setupRoom(roomCode) {
        this.setupChannels();
        this.setupSpotifyAuth();
        this.setupSpotify();

        this.channels.queue.fetch(code);
        this.roomCode = code;
        this.channels.status.getCurrent(code, this.onSongPlayed);
    }

    setupSpotify() {
        this.spotifyPlayer = new SpotifyPlayer(this.init.bind(this), this.onPlayerUpdate.bind(this));
        window.onSpotifyWebPlaybackSDKReady = this.spotifyPlayer.onSpotifyWebPlaybackSDKReady.bind(this.spotifyPlayer);
    }

    setupChannels() {
        const queueChannel = this.socket.joinChannel(QueueChannel);
        const userChannel = this.socket.joinChannel(UserChannel);
        const statusChannel = this.socket.joinChannel(StatusChannel);

        queueChannel.onSongProcessed();
        queueChannel.onQueuePop(this.queueView.pop);

        userChannel.onAuthUpdate(((auth) => { this.spotify_access_token = auth; }).bind(this));

        statusChannel.onSongStatusUpdate(this.statusView.updateStatusView);

        this.channels = {
            queue: queueChannel,
            user: userChannel,
            status: statusChannel
        }
    }

    setupView() {
        let that = this;
        this.submissionView = new SubmissionView((url) => {
            this.addSong.apply(that, [url]);
        });
        this.queueView = new QueueView((e) => {
            this.socket.userChannel.voteSkip();
        });
    }

    setupSpotifyAuth() {
        this.spotify_access_token = hj_spotify_access_token;
        this.spotify_refresh_token = hj_spotify_refresh_token;
    }

    setupModal() {
        this.enterModal.onCreateRoom(this.onCreateRoomReq.bind(this));
        this.enterModal.init();
    }

    setupAnimation() {
        this.animationStartTimestamp = + new Date();
        requestAnimationFrame(this.animate.bind(this));
    }

    addSong(url) {
        this.socket.addSong.apply(this.socket, [this.spotify_access_token, url]);
    }

    init(deviceId) {
        this.socket.registerUser(this.spotify_access_token, this.spotify_refresh_token, deviceId);
        this.socket.queue.fetch(this.roomCode, this.onFetchQueue.bind(this));
    }

    onFetchQueue(payload) {
        payload.queue.forEach(song => this.queueView.addToQueueDisplay(newSong));
    }

    onPlayerUpdate(status) {
        let isStarting = !status.paused;
        if (status.paused) {
            this.isPaused = true;
        } else {
            this.isPaused = false;
            this.songPlayedTime = + new Date() - status.position;
            this.currentSongLength = status.duration;
        }
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

    onCreateRoomReq() {
        this.channels.user.createRoom((payload => {
            this.joinRoom(payload["room_code"]);
        }).bind(this));
    }

    joinRoom(code) {
        this.enterModal.dismiss();
        history.pushState({}, document.title, code);
        this.setupRoom(code);
    }
}