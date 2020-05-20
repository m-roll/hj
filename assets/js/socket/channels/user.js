export default class UserChannel {
  constructor(socket, ...args) {
    let roomCode = args[0];
    this.userChannel = socket.channel("user:" + roomCode, {});
  }
  onAuthUpdate(authUpdateCb) {
    this.userChannel.on("auth:update", authUpdateCb);
  }
  register(roomCode, access_token, refresh_token, deviceId) {
    this.userChannel.push('user:register:' + roomCode, {
      spotifyAccessToken: access_token,
      spotifyRefreshToken: refresh_token,
      deviceId: deviceId
    })
  }
  join() {
    this.userChannel.join().receive("ok", resp => {
      console.log("Joined user channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join user channel", resp)
    })
  }
  voteSkip(roomCode) {
    this.userChannel.push("user:vote_skip:" + roomCode);
  }
  createRoom(cb) {
    this.userChannel.push("user:create_room").receive("ok", resp => {
      cb(resp);
    }).receive("error", resp => {
      console.warn("Error creating room", resp);
    })
  }
  setDeviceId(roomCode, newId) {
    this.userChannel.push("user:set_device:" + roomCode, {
      deviceId: newId
    });
  }
  getDevices(roomCode) {
    this.userChannel.push("user:get_devices:" + roomCode).receive("ok", resp => {
      this.receiveDevicesCb(resp);
    }).receive("error", resp => {
      console.warn("error retrieving user devices", resp);
    });
  }
  onReceiveDevices(cb) {
    this.receiveDevicesCb = cb;
  }
}