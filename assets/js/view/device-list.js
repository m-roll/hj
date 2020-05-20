import DevicePopoverView from "./popover/device-list";
export default class DeviceListView {
  constructor() {
    this.deviceListPopover = new DevicePopoverView();
    this.deviceListPopover.init();
  }
}