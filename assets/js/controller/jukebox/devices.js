export default class DevicesController {
  constructor(devicesView, devicesProviderThunk, roomCodeThunk) {
    this.devicesView = devicesView;
    this.devicesProviderThunk = devicesProviderThunk;
    this.roomCodeThunk = roomCodeThunk;
    this.isDeviceReady = false;
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
  _setupListeners() {
    this.devicesProviderThunk().onReceiveDevices((payload) => {
      this.devicesView.updateDevices(payload.devices);
      let hasActiveDevice = this._hasActiveDevice(payload.devices);
      this.devicesView.setHasActiveDevice(hasActiveDevice);
      if (hasActiveDevice && !this.isDeviceReady) {
        this.isDeviceReady = true;
        this._onReadyForPlaybackCb();
      } else if (!hasActiveDevice && this.isDeviceReady) {
        this.isDeviceReady = false;
        this._onNotReadyForPlaybackCb();
      }
    });
    this.devicesView.onDeviceListRefresh((() => {
      this.devicesProviderThunk().getDevices();
    }).bind(this));
    this.devicesView.onDeviceChangeSubmit(((newDevice) => {
      this.devicesProviderThunk().setDeviceId(newDevice);
    }).bind(this.devicesView));
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