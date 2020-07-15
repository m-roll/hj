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
export default function JukeboxController() {
  let isLoggedIn = typeof hj_resource_token !== 'undefined';
  // views
  const queueView = new QueueView();
  const playerView = new PlayerView();
  const statusView = new StatusView(playerView);
  const audioActivatorView = new AudioActivatorView();
  const joinRoomView = new JoinRoomView();
  const addTrackModal = new AddTrackModal();
  const roomNotFoundView = new RoomNotFoundView(joinRoomView);
  const logInModal = new LogInModal();
  const devicesView = new DevicesView(isLoggedIn, logInModal);
  const skipDetailsView = new SkipView();
  const errorModal = new ErrorModal();
  const roomCodeView = new RoomCodeView();
  const hostAlertView = new HostAlertView();
  const welcomeView = new WelcomeModal();
  // misc.
  let socket = new JukeboxSocket(isLoggedIn);
  let spotify_access_token;
  let songPlayedTime;
  let currentSongLength;
  let isPaused = true;
  let roomCode;
  let isListening = hj_listening;
  let onSongPlayed = (payload => statusView.updateStatusView(payload));
  let roomChannel;
  let isReadyForPlayback;
  let roomedChannels = {
    queue: null,
    user: null,
    userAnon: null,
    status: null,
    search: null
  }
  //misc providers
  // thunks
  const getRoomChannelThunk = () => roomChannel;
  const getSearchControllerThunk = () => roomedChannels.search;
  const getStatusChannelThunk = () => roomedChannels.status;
  const getQueueProviderThunk = () => roomedChannels.queue;
  const getUserChannelThunk = () => roomedChannels.user;
  const getUserPrefsProviderThunk = () => {
    return isLoggedIn ? roomedChannels.user : roomedChannels.userAnon;
  }
  const getUserAnonChannelThunk = () => roomedChannels.userAnon;
  const getUserPrefsControllerThunk = () => userPrefsController;
  const getSpotifyOAuthThunk = () => spotify_access_token;
  // secondary controllers
  const roomController = new RoomController(joinRoomView, roomNotFoundView, getRoomChannelThunk, _setupRoom);
  const addTrackController = new AddTrackController(addTrackModal, getSearchControllerThunk, roomController.getRoomCode);
  const statusController = new StatusController(statusView, getStatusChannelThunk,roomController.getRoomCode);
  const queueController = new QueueController(roomController.getRoomCode, getQueueProviderThunk, getQueueProviderThunk, getUserPrefsControllerThunk, queueView, statusView);
  const spotifyPlayer = new SpotifyPlayer(getSpotifyOAuthThunk);
  const skipController = new SkipController(getUserAnonChannelThunk, skipDetailsView);
  const userPrefsController = new UserPrefsController(isLoggedIn, getUserPrefsProviderThunk, new UserPrefsView());
  const hostsController = new HostsController(getUserChannelThunk, hostAlertView)
  //localPlaybackController = new SpotifyPlaybackController(this.spotifyPlayer, this.playerView, this.initAudio.bind(this));
  const animationController = new AnimationController(playerView);
  const devicesController = new DevicesController(devicesView, getUserChannelThunk, roomController.getRoomCode, isListening, errorModal, isLoggedIn);
  const welcomeController = new WelcomeController(welcomeView);
  
  //construct
  _setupEvents();
  
  roomChannel = socket.joinChannel(RoomChannel);
  roomController.ready();
  userPrefsController.setIsHost(false);

  function _setupEvents() {
    addTrackController.onSongSubmit(queueController.addSong);
    roomController.onRoomJoined(_setupRoom);
    devicesController.onReadyForPlayback(() => {
      roomedChannels.user.register();
    });
  }
  function _setupRoom(_roomCode) {
    setupRoomedChannels(_roomCode);
    if (isListening) {
      roomedChannels.user.refreshCredentials((creds) => {
        spotify_access_token = creds.access_token;
        //this.localPlaybackController.ready();
        //this.audioActivatorView.show();
      });
    }
    roomedChannels.queue.fetch(onFetchQueue);
    queueController.ready();
    devicesController.ready();
    skipController.ready();
    userPrefsController.ready();
    statusController.ready();
    roomCodeView.setRoomCode(_roomCode);
    roomCode = _roomCode;
    welcomeController.onRoomEnter();
  }
  function setupRoomedChannels(_roomCode) {
    let userChannel;
    if (isLoggedIn) {
      userChannel = socket.joinChannel(UserChannel, _roomCode, isLoggedIn);
    }
    let userAnonChannel = socket.joinChannel(UserAnonChannel, _roomCode);
    roomedChannels = {
      queue: socket.joinChannel(QueueChannel, _roomCode),
      user: userChannel,
      userAnon: userAnonChannel,
      status: socket.joinChannel(StatusChannel, _roomCode),
      search: socket.joinChannel(SearchChannel, _roomCode)
    }
    if (isLoggedIn) {
      _setupUserEvents();
    }
    roomCode = _roomCode;
  }
  function onFetchQueue(payload) {
    payload.queue.forEach(song => queueView.addToQueueDisplay.call(queueView, {
      song
    }));
  }
  function _setupUserEvents() {
    getUserChannelThunk().onAuthUpdate((auth) => {
      spotify_access_token = auth;
    });
    getUserChannelThunk().onRegister((payload) => {
      if (payload.is_host) {
        hostAlertView.show();
      }
      userPrefsController.setIsHost(payload.is_host);
    });
    getUserChannelThunk().onUserRegisterError((resp) => {
      console.log("Registration error", resp);
    });
    getUserChannelThunk().onUnregister((resp) => {
      userPrefsController.setIsHost(false);
      hostAlertView.hide();
    });
    devicesController.onNotReadyForPlayback(() => {
      //if the user does not have an active device, remove them from the user pool.
      roomedChannels.user.unregister();
    });
    window.addEventListener("beforeunload", (event) => {
      roomedChannels.user.unregister();
    });
  }
}