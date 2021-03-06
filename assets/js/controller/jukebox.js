import QueueView from "../view/queue.js";
import SpotifyPlayer from "../player/spotify";
import StatusView from "../view/status.js";
import SkipView from "../view/skip";
import JukeboxSocket from "../socket/socket.js";
import QueueChannel from "../socket/channels/queue.js";
import UserChannel from "../socket/channels/user.js";
import UserAnonChannel from "../socket/channels/user_anon";
import StatusChannel from "../socket/channels/status.js";
import RoomChannel from "../socket/channels/room.js";
import SearchChannel from "../socket/channels/search.js";
import PlayerView from "../view/player.js";
import AudioActivatorView from "../view/audio-activator.js";
import ErrorModal from "../view/modal/error-modal.js";
import AddTrackModal from "../view/modal/add-track-modal.js";
import AddTrackController from "./jukebox/add-track.js";
import StatusController from "./jukebox/status.js";
import RoomController from "./jukebox/room.js";
import QueueController from "./jukebox/queue.js";
import AnimationController from "./animation.js";
import RoomNotFoundView from "../view/room-not-found.js";
import JoinRoomView from "../view/join-room.js";
import DevicesView from "../view/devices.js";
import DevicesController from "./jukebox/devices.js";
import SkipController from "./jukebox/skip.js";
import UserPrefsController from "./jukebox/user-prefs.js";
import UserPrefsView from "../view/user-prefs.js";
import RoomCodeView from "../view/room-code.js";
import HostAlertView from "../view/alert/host.js";
import HostsController from "./jukebox/hosts.js";
import WelcomeModal from "../view/modal/welcome-modal.js";
import WelcomeController from "./jukebox/welcome.js";
import LogInModal from "../view/modal/log-in-modal.js";
export default class JukeboxController {
  isLoggedIn = typeof hj_resource_token !== 'undefined';
  // views
  queueView = new QueueView();
  playerView = new PlayerView();
  statusView = new StatusView(this.playerView);
  audioActivatorView = new AudioActivatorView();
  joinRoomView = new JoinRoomView();
  addTrackModal = new AddTrackModal();
  roomNotFoundView = new RoomNotFoundView(this.joinRoomView);
  logInModal = new LogInModal();
  devicesView = new DevicesView(this.isLoggedIn, this.logInModal);
  skipDetailsView = new SkipView();
  errorModal = new ErrorModal();
  roomCodeView = new RoomCodeView();
  hostAlertView = new HostAlertView();
  welcomeView = new WelcomeModal();
  // misc.
  spotifyPlayer;
  socket;
  spotify_access_token;
  songPlayedTime;
  currentSongLength;
  isPaused = true;
  roomCode;
  isListening;
  onSongPlayed = (payload => this.statusView.updateStatusView(payload)).bind(this);
  roomChannel;
  isReadyForPlayback;
  roomedChannels = {
    queue: null,
    user: null,
    userAnon: null,
    status: null,
    search: null
  }
  //misc providers
  // thunks
  getRoomChannelThunk = () => this.roomChannel;
  getSearchControllerThunk = () => this.roomedChannels.search;
  getStatusChannelThunk = () => this.roomedChannels.status;
  getQueueProviderThunk = () => this.roomedChannels.queue;
  getUserChannelThunk = () => this.roomedChannels.user;
  getUserPrefsProviderThunk = () => {
    console.log(this.roomedChannels);
    return this.isLoggedIn ? this.roomedChannels.user : this.roomedChannels.userAnon;
  }
  getUserAnonChannelThunk = () => this.roomedChannels.userAnon;
  getUserPrefsControllerThunk = () => this.userPrefsController;
  getSpotifyOAuthThunk = (() => this.spotify_access_token).bind(this);
  // secondary controllers
  roomController = new RoomController(this.joinRoomView, this.roomNotFoundView, this.getRoomChannelThunk, this.setupRoom.bind(this));
  addTrackController = new AddTrackController(this.addTrackModal, this.getSearchControllerThunk, this.roomController.getRoomCode);
  statusController = new StatusController(this.statusView, this.getStatusChannelThunk, this.roomController.getRoomCode);
  queueController = new QueueController(this.roomController.getRoomCode, this.getQueueProviderThunk, this.getQueueProviderThunk, this.getUserPrefsControllerThunk, this.queueView, this.statusView);
  spotifyPlayer = new SpotifyPlayer(this.getSpotifyOAuthThunk);
  skipController = new SkipController(this.getUserAnonChannelThunk, this.skipDetailsView);
  userPrefsController = new UserPrefsController(this.isLoggedIn, this.getUserPrefsProviderThunk, new UserPrefsView());
  hostsController = new HostsController(this.getUserChannelThunk, this.hostAlertView)
  //localPlaybackController = new SpotifyPlaybackController(this.spotifyPlayer, this.playerView, this.initAudio.bind(this));
  animationController = new AnimationController(this.playerView);
  devicesController = new DevicesController(this.devicesView, this.getUserChannelThunk, this.roomController.getRoomCode, this.isListening, this.errorModal, this.isLoggedIn);
  welcomeController = new WelcomeController(this.welcomeView);
  constructor() {
    this.setupEvents();
    this.socket = new JukeboxSocket(this.isLoggedIn);
    this.roomChannel = this.socket.joinChannel(RoomChannel);
    this.roomController.ready();
    this.isListening = hj_listening;
    this.userPrefsController.setIsHost(false);
  }
  setupEvents() {
    this.addTrackController.onSongSubmit(this.queueController.addSong.bind(this.queueController));
    this.roomController.onRoomJoined(this.setupRoom.bind(this));
    this.devicesController.onReadyForPlayback((() => {
      this.roomedChannels.user.register();
    }).bind(this));
  }
  setupRoom(roomCode) {
    this.setupRoomedChannels(roomCode);
    if (this.isListening) {
      this.roomedChannels.user.refreshCredentials(((creds) => {
        this.spotify_access_token = creds.access_token;
        //this.localPlaybackController.ready();
        //this.audioActivatorView.show();
      }).bind(this));
    }
    this.roomedChannels.queue.fetch(this.onFetchQueue.bind(this));
    this.queueController.ready();
    this.devicesController.ready();
    this.skipController.ready();
    this.userPrefsController.ready();
    this.statusController.ready();
    this.roomCodeView.setRoomCode(roomCode);
    this.roomCode = roomCode;
    this.welcomeController.onRoomEnter();
  }
  setupRoomedChannels(roomCode) {
    let userChannel;
    if (this.isLoggedIn) {
      userChannel = this.socket.joinChannel(UserChannel, roomCode, this.isLoggedIn);
    }
    let userAnonChannel = this.socket.joinChannel(UserAnonChannel, roomCode);
    console.log("Is logged in:", this.isLoggedIn);
    if (this.isLoggedIn) {
      this._setupUserEvents(userChannel, this.devicesView);
    }
    this.roomedChannels = {
      queue: this.socket.joinChannel(QueueChannel, roomCode),
      user: userChannel,
      userAnon: userAnonChannel,
      status: this.socket.joinChannel(StatusChannel, roomCode),
      search: this.socket.joinChannel(SearchChannel, roomCode)
    }
    this.roomCode = roomCode;
  }
  onFetchQueue(payload) {
    console.log("fetched queue:", payload)
    payload.queue.forEach(song => this.queueView.addToQueueDisplay.call(this.queueView, {
      song
    }));
  }
  _setupUserEvents(userProvider, userView) {
    userProvider.onAuthUpdate(((auth) => {
      this.spotify_access_token = auth;
    }).bind(this));
    userProvider.onRegister(((payload) => {
      console.log("Registered: ", payload)
      if (payload.is_host) {
        this.hostAlertView.show();
      }
      this.userPrefsController.setIsHost(payload.is_host);
    }).bind(this));
    userProvider.onUserRegisterError((resp) => {
      console.log("Registration error", resp);
    });
    userProvider.onUnregister((resp) => {
      console.log("Unregister");
      this.userPrefsController.setIsHost(false);
      this.hostAlertView.hide();
    });
    this.devicesController.onNotReadyForPlayback((() => {
      //if the user does not have an active device, remove them from the user pool.
      this.roomedChannels.user.unregister();
    }).bind(this));
    window.addEventListener("beforeunload", ((event) => {
      this.roomedChannels.user.unregister();
    }).bind(this));
  }
}