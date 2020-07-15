export default function  DevicesController(devicesView, devicesProviderThunk, roomCodeThunk, isListening, errorView, isLoggedIn) {
  let isDeviceReady = false;
  let hasAlreadyJoined;
  let devicesListCache;
  let onMuteCb;
  let _onReadyForPlaybackCb, _onNotReadyForPlaybackCb;
  function ready() {
    _setupListeners();
    if (isLoggedIn) {
      devicesProviderThunk().getDevices();
    }
  }
  function onReadyForPlayback(cb) {
    _onReadyForPlaybackCb = cb;
  }
  function onNotReadyForPlayback(cb) {
    _onNotReadyForPlaybackCb = cb;
  }
  function onMute(cb) {
    onMuteCb = cb;
  }
  function onListen(cb) {
    onListenCb = cb;
  }
  function setAlreadyJoined(alreadyJoined) {
    hasAlreadyJoined = alreadyJoined;
  }
  function _setupListeners() {
    if (isLoggedIn) {
      _setupLoggedInListeners();
    }
    devicesView.onDeviceListRefresh(() => {
      if (isLoggedIn) {
        devicesProviderThunk().getDevices();
      }
    });
  }
  function _setupLoggedInListeners() {
    devicesProviderThunk().onReceiveDevices((payload) => {
      devicesListCache = payload.devices;
      _updateDevices(payload.devices, isListening);
      console.log("Received devices");
    });
    devicesView.onDeviceChangeSubmit((newDevice) => {
      devicesProviderThunk().setDeviceId(newDevice, _onChangeDevice, (error) => {
        if (error.message === "already active") {
          devicesView.hide();
          errorView.error("Already playing music", `A device is already connected in queue '${error.room_code}'. Please disconnect audio there to listen to this queue.`)
        }
      });
    });
    devicesView.onMute(() => {
      isListening = false;
      _updateDevices(devicesListCache, isListening);
    });
  }
  function _updateDevices(devices) {
    devicesView.updateDevices(devices, isListening);
    let hasActiveDevice = _hasActiveDevice(devices);
    devicesView.setHasActiveDevice(hasActiveDevice);
    if (hasActiveDevice && !isDeviceReady) {
      isDeviceReady = true;
      _onReadyForPlaybackCb();
    } else if (!hasActiveDevice && isDeviceReady) {
      isDeviceReady = false;
      _onNotReadyForPlaybackCb();
    }
  }
  function _onChangeDevice(deviceId) {
    if (!isListening) {
      isListening = true;
      //_onReadyForPlaybackCb();
    }
    for (let i = 0; i < devicesListCache.length; i++) {
      let device = devicesListCache[i];
      device.is_active = device.id === deviceId;
      devicesListCache[i] = device;
    }
    _updateDevices(devicesListCache, isListening);
  }
  function _hasActiveDevice(devices) {
    for (let i = 0; i < devices.length; i++) {
      if (devices[i]["is_active"]) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }

  return {
    ready,
    onReadyForPlayback,
    onNotReadyForPlayback,
    onMute,
    onListen,
    setAlreadyJoined
  }
}