export default class DevicesController {
  devicesListCache;
  isListening;
  constructor(devicesView, devicesProviderThunk, roomCodeThunk, isListening, errorView) {
    this.devicesView = devicesView;
    this.devicesProviderThunk = devicesProviderThunk;
    this.roomCodeThunk = roomCodeThunk;
    this.isDeviceReady = false;
    this.isListening = isListening;
    this.errorView = errorView
  }
  ready() {
    this._setupListeners();
    this.devicesProviderThunk().getDevices();
  }
  onReadyForPlayback(cb) {
    this._onReadyForPlaybackCb = cb;
  }
  onNotReadyForPlayback(cb) {
    this._onNotReadyForPlaybackCb = cb;
  }
  onMute(cb) {
    this.onMuteCb = cb;
  }
  onListen(cb) {
    this.onListenCb = cb;
  }
  setAlreadyJoined(hasAlreadyJoined) {
    this.hasAlreadyJoined = hasAlreadyJoined;
  }
  _setupListeners() {
    this.devicesProviderThunk().onReceiveDevices((payload) => {
      this.devicesListCache = payload.devices;
      this._updateDevices(payload.devices, this.isListening);
    });
    this.devicesView.onDeviceListRefresh((() => {
      this.devicesProviderThunk().getDevices();
    }).bind(this));
    this.devicesView.onDeviceChangeSubmit(((newDevice) => {
      this.devicesProviderThunk().setDeviceId(newDevice, this._onChangeDevice.bind(this), ((error) => {
        if (error.message === "already active") {
          this.devicesView.hide();
          this.errorView.error("Already playing music", `A device is already connected in queue '${error.room_code}'. Please disconnect audio there to listen to this queue.`)
        }
      }).bind(this));
    }).bind(this.devicesView));
    this.devicesView.onMute(() => {
      this.isListening = false;
      this._updateDevices(this.devicesListCache, this.isListening);
    });
  }
  _updateDevices(devices) {
    this.devicesView.updateDevices(devices, this.isListening);
    let hasActiveDevice = this._hasActiveDevice(devices);
    this.devicesView.setHasActiveDevice(hasActiveDevice);
    if (hasActiveDevice && !this.isDeviceReady) {
      this.isDeviceReady = true;
      this._onReadyForPlaybackCb();
    } else if (!hasActiveDevice && this.isDeviceReady) {
      this.isDeviceReady = false;
      this._onNotReadyForPlaybackCb();
    }
  }
  _onChangeDevice(deviceId) {
    if (!this.isListening) {
      this.isListening = true;
      //this._onReadyForPlaybackCb();
    }
    for (let i = 0; i < this.devicesListCache.length; i++) {
      let device = this.devicesListCache[i];
      device.is_active = device.id === deviceId;
      this.devicesListCache[i] = device;
    }
    this._updateDevices(this.devicesListCache, this.isListening);
  }
  _hasActiveDevice(devices) {
    for (let i = 0; i < devices.length; i++) {
      if (devices[i]["is_active"]) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }
}