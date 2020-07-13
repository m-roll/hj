import $ from "jquery";
const id = "welcome-modal";
export default class WelcomeModal {
  constructor() {
    $('#' + id).modal({
      backdrop: true,
      keyboard: true,
      focus: false,
      show: false
    });
  }
  show() {
    $('#' + id).modal("show");
  }
  dismiss() {
    $('#' + id).modal("hide");
  }
}