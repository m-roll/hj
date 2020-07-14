export default class UserChannel {
  constructor(socket, ...args) {
    let roomCode = args[0];
    this.isLoggedIn = args[1];
    this.userChannel = socket.channel("user:" + roomCode, {});
  }
  onAuthUpdate(authUpdateCb) {
    this.userChannel.on("auth:update", authUpdateCb);
  }
  register() {
    this.userChannel.push('user:register').receive("ok", (resp => {
      if (resp.error) {
        this.onUserRegisterErrorCb(resp.error)
      } else {
        this.onRegisterCb(resp);
      }
    }).bind(this));
  }
  unregister() {
    this.userChannel.push('user:unregister').receive("ok", (resp => {
      this.onUnregisterCb(resp);
      console.log("Unregistered");
    }).bind(this));
  }
  onUnregister(cb) {
    this.onUnregisterCb = cb;
  }
  onSongStatusUpdate(songStatusUpdateCb) {
    this.songStatusUpdateCb = songStatusUpdateCb;
  }
  onRegister(cb) {
    this.onRegisterCb = cb;
  }
  onUserRegisterError(cb) {
    this.onUserRegisterErrorCb = cb;
  }
  join() {
    this.userChannel.join().receive("ok", resp => {
      console.log("Joined user channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join user channel", resp)
    })
  }
  createRoom(cb) {
    this.userChannel.push("user:create_room").receive("ok", resp => {
      cb(resp);
    }).receive("error", resp => {
      console.warn("Error creating room", resp);
    })
  }
  setDeviceId(newId, successCb, failureCb) {
    this.userChannel.push("user:set_device", {
      deviceId: newId
    }).receive("ok", (payload) => {
      if (payload && payload.error) {
        failureCb(payload.error);
      } else {
        successCb(newId);
      }
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
  onGetUserPrefs(cb) {
    this.onGetUserPrefsCb = cb;
  }
  fetchUserPrefs() {
    this.userChannel.push("user:prefs_get").receive("ok", (resp => {
      this.onGetUserPrefsCb(resp);
    }).bind(this)).receive("error", resp => {
      console.warn("error retrieving user preferences", resp);
    });
  }
  saveUserPrefs(prefs) {
    this.userChannel.push("user:prefs_save", prefs).receive("ok", (resp) => {
      //fire and forget
    });
  }
  onHostUpdated(cb) {
    this.userChannel.on("user:new_host", (resp => {
      cb(resp);
    }).bind(this));
  }
  checkIsHost(cb) {
    if (!this.isLoggedIn) {
      cb(false);
      return;
    }
    this.userChannel.push("user:get_authority").receive("ok", (resp => {
      cb(resp);
    }).bind(this));
  }
}