import SkipAlertView from "./alert/skip";
export default function SkipView() {
  const skipBtnId = "queue-skip";
  let skipBtn = document.getElementById(skipBtnId);
  let skipAlertView = new SkipAlertView();
  let isActive;
  let hasVoted;
  let skipCb;
  let unSkipCb;
  skipBtn.addEventListener("click", (e) => {
    console.log("Click, has voted", hasVoted);
    if (hasVoted) {
      activateSkipButton();
      unSkipCb();
    } else {
      disableSkipButton();
      skipCb();
    }
  });
  function setSkipValues(numSkipVotes, requiredSkipVotes) {
    skipAlertView.setSkipCount(requiredSkipVotes - numSkipVotes);
    if (requiredSkipVotes >= numSkipVotes) {
      skipAlertView.hide();
    }
    if (numSkipVotes === 0) {
      activateSkipButton();
      skipAlertView.hide();
    } else {
      skipAlertView.show();
    }
  }
  function activateSkipButton() {
    skipBtn.classList.remove("btn-primary");
  }
  function disableSkipButton() {
    skipBtn.classList.add("btn-primary");
  }
  function setHasVoted(_hasVoted) {
    hasVoted = _hasVoted;
    if (hasVoted) {
      disableSkipButton();
    } else {
      activateSkipButton();
    }
  }
  function onSkipRequest(cb) {
    skipCb = cb;
  }
  function onUnSkipRequest(cb) {
    unSkipCb = cb;
  }

  return {
    setSkipValues,
    activateSkipButton,
    disableSkipButton,
    setHasVoted,
    onSkipRequest,
    onUnSkipRequest
  }
}