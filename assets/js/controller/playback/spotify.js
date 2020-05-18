export default class SpotifyPlaybackController {
  constructor(spotifyPlayer, playerStatusReceiver, initAudioCb) {
    spotifyPlayer.onDeviceReady(initAudioCb);
    spotifyPlayer.onBrowserNotSupportedError(((errorMsg) => {
      console.warn("browser does not support web playback:", errorMsg);
      initAudioCb(null);
    }).bind(this));
    spotifyPlayer.onPlayerUpdate(playerStatusReceiver.updatePlayer.bind(playerStatusReceiver));
    window.onSpotifyWebPlaybackSDKReady = spotifyPlayer.onSpotifyWebPlaybackSDKReady.bind(spotifyPlayer);
    spotifyPlayer.initSpotifyScript();
  }
  ready() {}
}