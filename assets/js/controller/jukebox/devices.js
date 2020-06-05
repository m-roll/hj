export default class DevicesController {
  constructor(devicesView, devicesProviderThunk, roomCodeThunk) {
    this.devicesView = devicesView;
    this.devicesProviderThunk = devicesProviderThunk;
    this.roomCodeThunk = roomCodeThunk;
  }
  _setupListeners() {
    this.devicesProviderThunk().onReceiveDevices((payload) => {
      //intercept and add some mock data.
      payload.devices.push({
        name: "test1",
        active: false,
        type: "smartphone"
      });
      payload.devices.push({
        name: "test2",
        active: false,
        type: "tablet"
      })
      this.devicesView.updateDevices(payload.devices);
    });
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