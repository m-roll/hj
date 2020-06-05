import $ from "jquery";
import DeviceListView from "./device-list/device-list";
const modalSelector = "#device-list-modal";
const deviceOptionSelector = ".device-list-device";
export default class DeviceListModal {
  constructor() {
    this.modalElement = $(modalSelector);
    this.deviceListView = new DeviceListView();
    $('#device-list-close-btn').click((e => {
      this.dismiss();
    }).bind(this));
  }
  init() {
    $(modalSelector).modal({
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false
    });
  }
  populateDevicesList(devices) {
    this.deviceListView.updateDevices(devices);
    $(deviceOptionSelector).on('click', (event) => {
      let newDeviceId = event.target.value;
      this.onSelectDeviceCb(newDeviceId);
    });
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
}