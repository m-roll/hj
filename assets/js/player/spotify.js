import $ from "jquery";
const player_name = "Hillside Jukebox";
const getOAuthToken = (cb) => {
  return cb(hj_spotify_access_token);
}
export default class SpotifyPlayer {
  constructor(oAuthThunk) {
    this.getOAuthToken = oAuthThunk;
  }
  initSpotifyScript() {
    $.getScript("https://sdk.scdn.co/spotify-player.js");
  }
  onDeviceReady(cb) {
    this.deviceReadyCb = cb;
  }
  onBrowserNotSupportedError(cb) {
    this.browserNotSupportedErrorCb = cb;
  }
  onPlayerUpdate(cb) {
    this.updateCb = cb;
  }
  onSpotifyWebPlaybackSDKReady() {
    console.log("Web playback ready");
    const player = new Spotify.Player({
      name: player_name,
      getOAuthToken: this.getOAuthToken
    });
    // Error handling
    let browserNotSupportedError = this.browserNotSupportedErrorCb;
    player.addListener('initialization_error', ({
      message
    }) => {
      browserNotSupportedError(message);
    });
    player.addListener('authentication_error', ({
      message
    }) => {
      console.error(message);
    });
    player.addListener('account_error', ({
      message
    }) => {
      console.error(message);
    });
    player.addListener('playback_error', ({
      message
    }) => {
      console.error(message);
    });
    // Playback status updates
    let updateCb = this.updateCb;
    player.addListener('player_state_changed', state => {
      updateCb(state);
    });
    // Ready
    let readyCb = this.deviceReadyCb;
    player.addListener('ready', ({
      device_id
    }) => {
      console.log('Ready with Device ID', device_id);
      readyCb(device_id);
    });
    // Not Ready
    player.addListener('not_ready', ({
      device_id
    }) => {
      console.warn('Device ID has gone offline', device_id);
    });
    // Connect to the player!
    player.connect();
  };
}