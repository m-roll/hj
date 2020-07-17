import DeviceListModal from "./modal/device-list-modal";
export default function DevicesView(isLoggedIn, logInModal) {
  let devicesListModal = new DeviceListModal();
  let deviceListRefreshCb;
  devicesListModal.init();
  let devicesBtn = document.getElementById("btn-devices");
  let hasActiveDevice;
  devicesBtn.addEventListener("click", (e) => {
    if (isLoggedIn) {
      devicesListModal.show();
      deviceListRefreshCb();
    } else {
      logInModal.show();
    }
  });
  function updateDevices(devices, isListening) {
    devicesListModal.populateDevicesList(devices, isListening);
  }
  function onDeviceChangeSubmit(cb) {
    devicesListModal.onChangeDevice(cb);
  }
  function onMute(cb) {
    devicesListModal.onMute(cb);
  }
  function onDeviceListRefresh(cb) {
    console.log("On device list refresh cb")
    deviceListRefreshCb = cb;
  }
  function setHasActiveDevice(_hasActiveDevice) {
    hasActiveDevice = _hasActiveDevice;
    if (hasActiveDevice) {
      devicesBtn.classList.remove("devices-disabled");
    } else {
      devicesBtn.classList.add("devices-disabled");
    }
  }
  function hide() {
    devicesListModal.dismiss();
  }

  return {
    updateDevices,
    onDeviceChangeSubmit,
    onMute,
    onDeviceListRefresh,
    setHasActiveDevice,
    hide
  }
}