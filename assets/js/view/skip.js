const skipBtnId = "queue-skip";
export default class SkipView {
  isActive;
  constructor() {
    this.skipBtn = document.getElementById(skipBtnId);
  }
  setSkipValues(numSkipVotes, requiredSkipVotes) {
    if (numSkipVotes === 0) {
      this._activateButton();
    }
    console.log("node value", this.skipBtn);
    this.skipBtn.innerText = this._formatText(numSkipVotes, requiredSkipVotes);
  }
  _activateSkipButton() {
    this.skipBtn.classList.remove("disabled");
  }
  _disableSkipButton() {
    this.skipBtn.classList.add("disabled");
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