import $ from "jquery";
export default class HostAlertView {
  constructor() {
    $('#toast-host-alert').toast({
      autohide: true,
      delay: 5 * 60 * 1000
    });
  }
  show() {
    $('#toast-host-alert').toast('show');
  }
  hide() {
    $('#toast-host-alert').toast('hide');
  }
}