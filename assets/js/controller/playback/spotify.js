export default class SpotifyPlaybackController {
  constructor(spotifyPlayer, initAudioCb, playerUpdateCb) {
    spotifyPlayer.onDeviceReady(initAudioCb);
    spotifyPlayer.onBrowserNotSupportedError(((errorMsg) => {
      console.log("browser does not support web playback:", errorMsg);
      initAudioCb(null);
    }).bind(this));
    spotifyPlayer.onPlayerUpdate(playerUpdateCb);
    window.onSpotifyWebPlaybackSDKReady = spotifyPlayer.onSpotifyWebPlaybackSDKReady.bind(spotifyPlayer);
    spotifyPlayer.initSpotifyScript();
  }
  ready() {}
}