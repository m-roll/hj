import $ from "jquery";
const modalSelector = "#user-prefs-modal";
export default class UserPrefsModal {
  constructor() {
    this.modalElement = $(modalSelector);
  }
  init() {
    $(modalSelector).modal({
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false
    });
    $("#user-prefs-modal-dismiss").on("click", ((event) => {
      this.dismiss();
    }).bind(this));
  }
  show() {
    $(modalSelector).modal('show');
  }
  onDismiss(cb) {
    $(modalSelector).on("hide.bs.modal", cb);
  }
  dismiss() {
    $(modalSelector).modal('hide');
  }
  /**
   * 
   * prefs = {
   *   nickname,
   *   skipThreshold
   * }
   */
  setUserPrefs(prefs) {
    $('#user-pref-form-num-skips').val(prefs.skipThreshold);
    $('#user-pref-form-nickname').val(prefs.nickname);
  }
  collectUserPrefs(prefs) {
    return {
      skipThreshold: $('#user-pref-form-num-skips').val(),
      nickname: $('#user-pref-form-nickname').val()
    }
  }
  setIsHost(isHost) {
    $('#user-pref-form-num-skips').prop("disabled", !isHost);
    $('#user-pref-allow-anon-vote').prop("disabled", !isHost);
  }
}