export default class UserChannel {
  constructor(socket, ...args) {
    let roomCode = args[0];
    this.userChannel = socket.channel("user:" + roomCode, {});
  }
  onAuthUpdate(authUpdateCb) {
    this.userChannel.on("auth:update", authUpdateCb);
  }
  register() {
    this.userChannel.push('user:register').receive("ok", resp => {
      this.songStatusUpdateCb(resp);
      //should throw some error if we cannot add to user pool. Maybe "could not sync with queue"
    })
  }
  unregister() {
    this.userChannel.push('user:unregister').receive("ok", resp => {
      // fire and forget
    });
  }
  onSongStatusUpdate(songStatusUpdateCb) {
    this.songStatusUpdateCb = songStatusUpdateCb;
  }
  join() {
    this.userChannel.join().receive("ok", resp => {
      console.log("Joined user channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join user channel", resp)
    })
  }
  voteSkip(roomCode) {
    this.userChannel.push("user:vote_skip").receive(resp => {
      //TODO maybe grey out the skip button
    });
  }
  createRoom(cb) {
    this.userChannel.push("user:create_room").receive("ok", resp => {
      cb(resp);
    }).receive("error", resp => {
      console.warn("Error creating room", resp);
    })
  }
  setDeviceId(newId, successCb) {
    this.userChannel.push("user:set_device", {
      deviceId: newId
    }).receive("ok", () => {
      successCb(newId);
    });
  }
  getDevices() {
    this.userChannel.push("user:get_devices").receive("ok", (resp => {
      this.receiveDevicesCb(resp);
    }).bind(this)).receive("error", resp => {
      console.warn("error retrieving user devices", resp);
    });
  }
  refreshCredentials(cb) {
    this.userChannel.push("user:refresh_credentials").receive("ok", (resp => {
      cb(resp);
    }).bind(this)).receive("error", resp => {
      console.warn("error refreshing user credentials", resp);
    });
  }
  onReceiveDevices(cb) {
    this.receiveDevicesCb = cb;
  }
}