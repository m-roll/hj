export default class DevicesController {
  constructor(devicesView, devicesProviderThunk, roomCodeThunk) {
    this.devicesView = devicesView;
    this.devicesProviderThunk = devicesProviderThunk;
    this.roomCodeThunk = roomCodeThunk;
  }
  _setupListeners() {
    this.devicesProviderThunk().onReceiveDevices((payload) => {
      this.devicesView.updateDevices(payload.devices);
    });
    this.devicesView.onDeviceListRefresh((() => {
      this.devicesProviderThunk().getDevices(this.roomCodeThunk());
    }).bind(this));
    this.devicesView.onDeviceChangeSubmit(((newDevice) => {
      this.devicesProviderThunk().setDeviceId(this.roomCodeThunk(), newDevice);
    }).bind(this.devicesView));
  }
  ready() {
    this._setupListeners();
  }
}