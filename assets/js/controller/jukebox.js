import QueueView from "../view/queue.js";
import SpotifyPlayer from "../player/spotify";
import StatusView from "../view/status.js";
import JukeboxSocket from "../socket/socket.js";
import QueueChannel from "../socket/channels/queue.js";
import UserChannel from "../socket/channels/user.js";
import StatusChannel from "../socket/channels/status.js";
import RoomChannel from "../socket/channels/room.js";
import SearchChannel from "../socket/channels/search.js";
import PlayerView from "../view/player.js";
import AudioActivatorView from "../view/audio-activator.js";
import EnterModal from "../view/modal/enter-modal.js";
import ListenInAndProgressBarView from "../view/listen-in-indicator.js";
import AddTrackModal from "../view/modal/add-track-modal.js";
import AddTrackController from "./jukebox/add-track.js";
import StatusController from "./jukebox/status.js";
import RoomController from "./jukebox/room.js";
import QueueController from "./jukebox/queue.js";
import SpotifyPlaybackController from "./playback/spotify.js";
import AnimationController from "./animation.js";
import RoomNotFoundView from "../view/room-not-found.js";
import JoinRoomView from "../view/join-room.js";
import DeviceListView from "../view/device-list.js";
import DevicesController from "./jukebox/devices.js";
export default class JukeboxController {
  // views
  queueView = new QueueView();
  statusView = new StatusView();
  playerView = new PlayerView();
  audioActivatorView = new AudioActivatorView();
  listenInAndProgressBarView = new ListenInAndProgressBarView();
  joinRoomView = new JoinRoomView();
  addTrackModal = new AddTrackModal();
  roomNotFoundView = new RoomNotFoundView(this.joinRoomView);
  deviceListView = new DeviceListView();
  // misc.
  spotifyPlayer;
  socket = new JukeboxSocket();
  spotify_access_token;
  songPlayedTime;
  currentSongLength;
  isPaused = true;
  roomCode;
  isListening;
  onSongPlayed = (payload => this.statusView.updateStatusView(payload)).bind(this);
  roomChannel;
  roomedChannels = {
    queue: null,
    user: null,
    status: null,
    search: null
  }
  roomChannel = this.socket.joinChannel(RoomChannel);
  // thunks
  getRoomChannelThunk = () => this.roomChannel;
  getSearchControllerThunk = () => this.roomedChannels.search;
  getStatusProviderThunk = () => this.roomedChannels.status;
  getQueueProviderThunk = () => this.roomedChannels.queue;
  // secondary controllers
  roomController = new RoomController(this.joinRoomView, this.roomNotFoundView, this.getRoomChannelThunk, this.setupRoom.bind(this));
  addTrackController = new AddTrackController(this.addTrackModal, this.getSearchControllerThunk, this.roomController.getRoomCode);
  statusController = new StatusController(this.statusView, this.getStatusProviderThunk, this.roomController.getRoomCode);
  queueController = new QueueController(this.roomController.getRoomCode, this.getQueueProviderThunk, this.getQueueProviderThunk, this.queueView);
  localPlaybackController = new SpotifyPlaybackController(new SpotifyPlayer(), this.playerView, this.initAudio.bind(this));
  animationController = new AnimationController(this.playerView);
  devicesController = new DevicesController(this.deviceListView);
  constructor() {
    this.setupEvents();
  }
  setupEvents() {
    this.addTrackController.onSongSubmit(this.queueController.addSong.bind(this.queueController));
    this.roomController.onRoomJoined(this.setupRoom.bind(this));
  }
  setupRoom(roomCode, isListening) {
    this.setupRoomedChannels(roomCode);
    isListening = typeof hj_spotify_access_token !== 'undefined';
    this.listenInAndProgressBarView.setListening(isListening);
    if (isListening) {
      this.setupSpotifyAuth();
      this.audioActivatorView.show();
    } else {
      this.listenInAndProgressBarView.setRoomCode(roomCode);
    }
    this.statusController.ready();
    this.queueController.ready();
    this.roomCode = roomCode;
  }
  setupRoomedChannels(roomCode) {
    let userChannel = this.socket.joinChannel(UserChannel, roomCode);
    userChannel.onAuthUpdate(((auth) => {
      this.spotify_access_token = auth;
    }).bind(this));
    this.roomedChannels = {
      queue: this.socket.joinChannel(QueueChannel),
      user: userChannel,
      status: this.socket.joinChannel(StatusChannel),
      search: this.socket.joinChannel(SearchChannel)
    }
    this.roomCode = roomCode;
  }
  setupSpotifyAuth() {
    this.spotify_access_token = hj_spotify_access_token;
    this.spotify_refresh_token = hj_spotify_refresh_token;
  }
  initAudio(deviceId) {
    this.audioActivatorView.setContents("Click anywhere to tune in");
    this.audioActivatorView.onDismiss((() => {
      this.roomedChannels.user.register(this.roomCode, this.spotify_access_token, this.spotify_refresh_token, deviceId);
      this.roomedChannels.queue.fetch(this.roomCode, this.onFetchQueue.bind(this));
    }).bind(this));
  }
  onFetchQueue(payload) {
    payload.queue.forEach(song => this.queueView.addToQueueDisplay.call(this.queueView, {
      song
    }));
  }
}