import DeviceListModal from "./modal/device-list-modal";
export default class DevicesView {
  constructor() {
    this.devicesListModal = new DeviceListModal();
    this.devicesListModal.init();
    document.getElementById("btn-devices").addEventListener("click", ((e) => {
      this.devicesListModal.show();
      this.deviceListRefreshCb();
    }).bind(this));
  }
  updateDevices(devices) {
    console.log(devices);
    this.devicesListModal.populateDevicesList(devices);
  }
  onDeviceChangeSubmit(cb) {
    this.devicesListModal.onChangeDevice(cb);
  }
  onDeviceListRefresh(cb) {
    this.deviceListRefreshCb = cb;
  }
}