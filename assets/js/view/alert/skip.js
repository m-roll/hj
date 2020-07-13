import $ from "jquery";
export default class SkipAlertView {
  constructor() {
    $('#toast-skip-alert').toast({
      autohide: true,
      delay: 5 * 60 * 1000
    });
  }
  setSkipCount(count) {
    $('#skip-alert-vote-count').text(String(count));
  }
  show() {
    $('#toast-skip-alert').toast('show');
  }
  hide() {
    $('#toast-skip-alert').toast('hide');
  }
}