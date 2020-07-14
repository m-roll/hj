import $ from "jquery";
const id = "welcome-modal";
const formId = "welcome-form";
import {
  getInputValueFromForm
} from '../util/jquery.js';
export default class WelcomeModal {
  constructor() {
    $('#' + id).modal({
      backdrop: true,
      keyboard: true,
      focus: false,
      show: false
    });
    document.getElementById("welcome-modal-dismiss").addEventListener("click", (e) => {
      $('#' + id).modal('hide');
    });
  }
  onWelcomeFormSubmit(cb) {
    $('#' + formId).on('submit', ((event) => {
      console.log("welcome form submit", cb);
      event.preventDefault();
      event.stopPropagation();
      let doNotShow = document.getElementById("welcome-do-not-show").checked;
      cb(doNotShow);
      this.dismiss();
      return false;
    }).bind(this))
  }
  show() {
    $('#' + id).modal("show");
  }
  dismiss() {
    $('#' + id).modal("hide");
  }
}