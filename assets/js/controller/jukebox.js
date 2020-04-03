import SubmissionView from "../view/submission.js";
import QueueView from "../view/queue.js";
import SpotifyPlayer from "../player/spotify";
import StatusView from "../view/status.js";
import JukeboxSocket from "../socket/socket.js";
import QueueChannel from "../socket/channels/queue.js";
import UserChannel from "../socket/channels/user.js";
import StatusChannel from "../socket/channels/status.js";
import RoomChannel from "../socket/channels/room.js";
import PlayerView from "../view/player.js";
import EnterModal from "../view/enter-modal.js";
import RoomNotFoundModal from "../view/room-nf-modal.js";

export default class JukeboxController {

    queueView;
    statusView = new StatusView();
    playerView = new PlayerView();
    enterModal = new EnterModal();
    roomNfModal = new RoomNotFoundModal();
    submissionView;
    spotifyPlayer;
    socket = new JukeboxSocket();
    spotify_access_token;
    songPlayedTime;
    currentSongLength;
    animationStartTimestamp;
    isPaused = true;
    roomCode;

    onSongPlayed = (payload => this.statusView.updateStatusView(payload)).bind(this);

    roomChannel;

    roomedChannels = {
        queue: null,
        user: null,
        status: null
    }

    constructor() {
        this.setupView();
        this.roomChannel = this.socket.joinChannel(RoomChannel);
        if (typeof room_code !== 'undefined' && room_code !== null) {
            this.tryJoinRoom(room_code);
        } else {
            this.setupEnterModal();
        }

        this.setupAnimation();
    }

    tryJoinRoom(roomCode) {
        this.roomChannel.checkExists(roomCode,
            (roomCode => {
                this.setupRoom(roomCode)
            }).bind(this),
            (error => {
                this.showRoomNotFoundError(room_code);
            }).bind(this)
        );
    }

    setupRoom(roomCode, isListening) {
        this.setupRoomedChannels(roomCode);
        this.setupSpotifyAuth();
        this.setupSpotify();

        this.roomedChannels.queue.fetch(roomCode);
        this.roomedChannels.status.getCurrent(roomCode, this.onSongPlayed);

        this.roomCode = roomCode;
    }

    showRoomNotFoundError(roomCode) {
        this.setupRoomNfModal();
    }

    setupSpotify() {
        this.spotifyPlayer = new SpotifyPlayer(this.init.bind(this), this.onPlayerUpdate.bind(this));
        window.onSpotifyWebPlaybackSDKReady = this.spotifyPlayer.onSpotifyWebPlaybackSDKReady.bind(this.spotifyPlayer);
    }

    setupRoomedChannels(roomCode) {
        const queueChannel = this.socket.joinChannel(QueueChannel);
        const userChannel = this.socket.joinChannel(UserChannel);
        const statusChannel = this.socket.joinChannel(StatusChannel);

        queueChannel.onSongProcessed(roomCode, this.queueView.addToQueueDisplay.bind(this.queueView));
        queueChannel.onQueuePop(roomCode, this.queueView.pop);

        userChannel.onAuthUpdate(((auth) => { this.spotify_access_token = auth; }).bind(this));

        statusChannel.onSongStatusUpdate(roomCode, this.onSongPlayed);

        this.roomedChannels = {
            queue: queueChannel,
            user: userChannel,
            status: statusChannel
        }

        this.roomCode = roomCode;
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

    setupEnterModal() {
        this.enterModal.init();
        this.enterModal.onJoinRoom(this.tryJoinRoom.bind(this));
    }

    setupRoomNfModal() {
        this.roomNfModal.init();
        this.roomNfModal.onAccept((() => {
            this.roomNfModal.dismiss();
            this.mockRedirectHome();
        }).bind(this));
    }

    mockRedirectHome() {
        console.log("Faking redirect home");
        history.pushState({}, document.title, '/');
        room_code = null;
        this.setupEnterModal();
    }

    setupAnimation() {
        this.animationStartTimestamp = + new Date();
        requestAnimationFrame(this.animate.bind(this));
    }

    addSong(url) {
        this.roomedChannels.queue.addSong.apply(this.roomedChannels.queue, [this.roomCode, url]);
    }

    init(deviceId) {
        this.roomedChannels.user.register(this.roomCode, this.spotify_access_token, this.spotify_refresh_token, deviceId);
        this.roomedChannels.queue.fetch(this.roomCode, this.onFetchQueue.bind(this));
    }

    onFetchQueue(payload) {
        payload.queue.forEach(song => this.queueView.addToQueueDisplay(song));
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

    joinRoom(code) {
        this.enterModal.dismiss();
        history.pushState({}, document.title, code);
        this.setupRoom(code);
    }
}