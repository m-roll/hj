import $ from "jquery";
export default class HostAlertView {
  show() {
    console.log("Show alert")
    $('#alert-host').alert();
  }
}