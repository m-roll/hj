export default class DevicesController {
  constructor(devicesView, devicesProviderThunk, roomCodeThunk) {
    this.devicesView = devicesView;
    this.devicesProviderThunk = devicesProviderThunk;
    this.roomCodeThunk = roomCodeThunk;
  }
  _setupListeners() {
    this.devicesProviderThunk().onReceiveDevices(this.devicesView.updateDevices.bind(this.devicesView));
    this.devicesView.onDeviceListRefresh((() => {
      this.devicesProviderThunk().getDevices(this.roomCodeThunk());
    }).bind(this));
    this.devicesView.onDeviceChangeSubmit(((newDevice) => {
      this.devicesProviderThunk().setDeviceId(this.roomCodeThunk(), newDevice);
    }).bind(this));
  }
  ready() {
    this._setupListeners();
  }
}