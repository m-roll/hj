export default class SpotifyPlaybackController {
  constructor(spotifyPlayer, playerStatusReceiver, initAudioCb) {
    this.spotifyPlayer = spotifyPlayer;
    this.playerStatusReceiver = playerStatusReceiver;
    this.initAudioCb = initAudioCb;
    this.setupListeners();
    this.spotifyPlayer = spotifyPlayer;
  }
  setupListeners() {
    this.spotifyPlayer.onDeviceReady(this.initAudioCb);
    this.spotifyPlayer.onBrowserNotSupportedError(((errorMsg) => {
      console.warn("browser does not support web playback:", errorMsg);
      this.initAudioCb(null);
    }).bind(this));
    this.spotifyPlayer.onPlayerUpdate(this.playerStatusReceiver.updatePlayer.bind(this.playerStatusReceiver));
    window.onSpotifyWebPlaybackSDKReady = this.spotifyPlayer.onSpotifyWebPlaybackSDKReady.bind(this.spotifyPlayer);
  }
  ready() {
    this.spotifyPlayer.initSpotifyScript();
  }
}