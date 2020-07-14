import DeviceListModal from "./modal/device-list-modal";
export default class DevicesView {
  constructor(isLoggedIn, logInModal) {
    this.devicesListModal = new DeviceListModal();
    this.devicesListModal.init();
    this.devicesBtn = document.getElementById("btn-devices");
    this.devicesBtn.addEventListener("click", ((e) => {
      if (isLoggedIn) {
        this.devicesListModal.show();
        this.deviceListRefreshCb();
      } else {
        logInModal.show();
      }
    }).bind(this));
  }
  updateDevices(devices, isListening) {
    this.devicesListModal.populateDevicesList(devices, isListening);
  }
  onDeviceChangeSubmit(cb) {
    this.devicesListModal.onChangeDevice(cb);
  }
  onMute(cb) {
    this.devicesListModal.onMute(cb);
  }
  onDeviceListRefresh(cb) {
    console.log("On device list refresh cb")
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
  hide() {
    this.devicesListModal.dismiss();
  }
}