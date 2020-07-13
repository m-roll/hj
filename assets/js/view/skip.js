import SkipAlertView from "./alert/skip";
const skipBtnId = "queue-skip";
export default class SkipView {
  isActive;
  constructor() {
    this.skipBtn = document.getElementById(skipBtnId);
    this.skipAlertView = new SkipAlertView();
  }
  setSkipValues(numSkipVotes, requiredSkipVotes) {
    this.skipAlertView.setSkipCount(requiredSkipVotes - numSkipVotes);
    if (numSkipVotes === 0) {
      this._activateButton();
      this.skipAlertView.hide();
    } else {
      this.skipAlertView.show();
    }
  }
  _activateSkipButton() {
    this.skipBtn.classList.remove("btn-primary");
  }
  _disableSkipButton() {
    this.skipBtn.classList.add("btn-primary");
  }
  onSkipRequest(cb) {
    this.skipBtn.addEventListener("click", (e) => {
      this._disableSkipButton();
      cb();
    });
  }
  _formatText(numSkipVotes, requiredSkipVotes) {
    return `skip (${numSkipVotes}/${requiredSkipVotes})`;
  }
}