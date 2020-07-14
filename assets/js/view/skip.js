import SkipAlertView from "./alert/skip";
const skipBtnId = "queue-skip";
export default class SkipView {
  isActive;
  constructor() {
    this.skipBtn = document.getElementById(skipBtnId);
    this.skipAlertView = new SkipAlertView();
    this.skipBtn.addEventListener("click", (e) => {
      console.log("Click, has voted", this.hasVoted);
      if (this.hasVoted) {
        this.activateSkipButton();
        this.unSkipCb();
      } else {
        this.disableSkipButton();
        this.skipCb();
      }
    });
  }
  setSkipValues(numSkipVotes, requiredSkipVotes) {
    this.skipAlertView.setSkipCount(requiredSkipVotes - numSkipVotes);
    if (requiredSkipVotes >= numSkipVotes) {
      this.skipAlertView.hide();
    }
    if (numSkipVotes === 0) {
      this.activateSkipButton();
      this.skipAlertView.hide();
    } else {
      this.skipAlertView.show();
    }
  }
  activateSkipButton() {
    this.skipBtn.classList.remove("btn-primary");
  }
  disableSkipButton() {
    this.skipBtn.classList.add("btn-primary");
  }
  setHasVoted(hasVoted) {
    this.hasVoted = hasVoted;
    if (hasVoted) {
      this.disableSkipButton();
    } else {
      this.activateSkipButton();
    }
  }
  onSkipRequest(cb) {
    this.skipCb = cb;
  }
  onUnSkipRequest(cb) {
    this.unSkipCb = cb;
  }
  _formatText(numSkipVotes, requiredSkipVotes) {
    return `skip (${numSkipVotes}/${requiredSkipVotes})`;
  }
}