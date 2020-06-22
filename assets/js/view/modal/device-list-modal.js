import $ from "jquery";
import DeviceListView from "./device-list/device-list";
const modalSelector = "#device-list-modal";
export default class DeviceListModal {
  hasMuted;
  constructor() {
    this.modalElement = $(modalSelector);
    this.deviceListView = new DeviceListView();
    this.deviceListView.onDismiss(() => {
      this.dismiss();
    });
  }
  init() {
    $(modalSelector).modal({
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false
    });
    $("#devices-modal-dismiss").on("click", ((event) => {
      this.dismiss();
    }).bind(this));
  }
  populateDevicesList(devices, isListening) {
    let devicesCopy = devices.slice(0);
    if (devicesCopy.length === 0) {
      this.deviceListView.hasNoDevices();
    } else {
      if (!isListening) {
        this._setNoneActiveBang(devicesCopy);
        console.log("should be muted", devicesCopy);
      }
      devicesCopy.unshift({
        id: 'none',
        type: 'mute',
        name: 'No audio',
        is_active: !isListening
      })
      this.deviceListView.updateDevices(devicesCopy);
    }
  }
  onMute(cb) {
    this.deviceListView.onMute(cb);
  }
  onChangeDevice(cb) {
    this.deviceListView.onSelectDevice(cb);
  }
  show() {
    $(modalSelector).modal('show');
  }
  dismiss() {
    $(modalSelector).modal('hide');
  }
  _setNoneActiveBang(devices) {
    for (let i = 0; i < devices.length; i++) {
      devices[i].is_active = false;
    }
  }
}