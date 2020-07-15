export default function UserChannel(socket, ...args) {
  let roomCode = args[0];
  let isLoggedIn = args[1];
  let userChannel = socket.channel("user:" + roomCode, {});
  let onRegisterCb;
  let onUnregisterCb;
  let onUserRegisterErrorCb;
  let receiveDevicesCb;
  let onGetUserPrefsCb;
  function onAuthUpdate(authUpdateCb) {
    userChannel.on("auth:update", authUpdateCb);
  }
  function register() {
    userChannel.push('user:register').receive("ok", resp => {
      if (resp.error) {
        onUserRegisterErrorCb(resp.error)
      } else {
        onRegisterCb(resp);
      }
    });
  }
  function unregister() {
    userChannel.push('user:unregister').receive("ok", resp => {
      onUnregisterCb(resp);
      console.log("Unregistered");
    });
  }
  function onUnregister(cb) {
    onUnregisterCb = cb;
  }
  function onSongStatusUpdate(_songStatusUpdateCb) {
    songStatusUpdateCb = _songStatusUpdateCb;
  }
  function onRegister(cb) {
    onRegisterCb = cb;
  }
  function onUserRegisterError(cb) {
    onUserRegisterErrorCb = cb;
  }
  function join() {
    userChannel.join().receive("ok", resp => {
      console.log("Joined user channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join user channel", resp)
    })
  }
  function createRoom(cb) {
    userChannel.push("user:create_room").receive("ok", resp => {
      cb(resp);
    }).receive("error", resp => {
      console.warn("Error creating room", resp);
    })
  }
  function setDeviceId(newId, successCb, failureCb) {
    userChannel.push("user:set_device", {
      deviceId: newId
    }).receive("ok", (payload) => {
      if (payload && payload.error) {
        failureCb(payload.error);
      } else {
        successCb(newId);
      }
    });
  }
  function getDevices() {
    userChannel.push("user:get_devices").receive("ok", resp => {
      receiveDevicesCb(resp);
    }).receive("error", resp => {
      console.warn("error retrieving user devices", resp);
    });
  }
  function refreshCredentials(cb) {
    userChannel.push("user:refresh_credentials").receive("ok", resp => {
      cb(resp);
    }).receive("error", resp => {
      console.warn("error refreshing user credentials", resp);
    });
  }
  function onReceiveDevices(cb) {
    receiveDevicesCb = cb;
  }
  function onGetUserPrefs(cb) {
    onGetUserPrefsCb = cb;
  }
  function fetchUserPrefs() {
    userChannel.push("user:prefs_get").receive("ok", resp => {
      onGetUserPrefsCb(resp);
    }).receive("error", resp => {
      console.warn("error retrieving user preferences", resp);
    });
  }
  function saveUserPrefs(prefs) {
    userChannel.push("user:prefs_save", prefs).receive("ok", (resp) => {
      //fire and forget
    });
  }
  function onHostUpdated(cb) {
    userChannel.on("user:new_host", resp => {
      cb(resp);
    });
  }
  function checkIsHost(cb) {
    if (!isLoggedIn) {
      cb(false);
      return;
    }
    userChannel.push("user:get_authority").receive("ok", resp => {
      cb(resp);
    });
  }

  return {
    onAuthUpdate,
    register,
    unregister,
    onUnregister,
    onRegister,
    onSongStatusUpdate,
    onUserRegisterError,
    join,
    createRoom,
    setDeviceId,
    getDevices,
    refreshCredentials,
    onReceiveDevices,
    onGetUserPrefs,
    fetchUserPrefs,
    saveUserPrefs,
    onHostUpdated,
    checkIsHost
  }
}