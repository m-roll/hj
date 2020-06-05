import DeviceListModal from "./modal/device-list-modal";
export default class DevicesView {
  constructor() {
    this.devicesListModal = new DeviceListModal();
    this.devicesListModal.init();
    this.devicesBtn = document.getElementById("btn-devices");
    this.devicesBtn.addEventListener("click", ((e) => {
      this.devicesListModal.show();
      this.deviceListRefreshCb();
    }).bind(this));
  }
  updateDevices(devices) {
    this.devicesListModal.populateDevicesList(devices);
  }
  onDeviceChangeSubmit(cb) {
    this.devicesListModal.onChangeDevice(cb);
  }
  onDeviceListRefresh(cb) {
    this.deviceListRefreshCb = cb;
  }
  setHasActiveDevice(hasActiveDevice) {
    this.hasActiveDevice = hasActiveDevice;
    if (hasActiveDevice) {
      this.devicesBtn.classList.remove("devices-disabled");
    } else {
      this.devicesBtn.classList.add("devices-disabled");
    }
  }
}