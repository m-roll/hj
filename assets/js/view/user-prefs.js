import UserPrefsModal from "./modal/user-prefs-modal";
export default function UserPrefsView() {
  let userPrefsModal = new UserPrefsModal();
  let userPrefsBtn = document.getElementById("settings-button");
  let onPrefsOpenCb;
  userPrefsModal.init();
  userPrefsBtn.addEventListener("click", (event) => {
    onPrefsOpenCb();
    userPrefsModal.show();
  });

  function onPrefsOpen(cb) {
    onPrefsOpenCb = cb;
  }
  function onPrefsSubmit(cb) {
    userPrefsModal.onDismiss(() => {
      cb(getUserPrefChanges());
    });
  }
  //should only be called when fecthing pre-set data, logged-in users only.
  function setUserPrefs(prefs) {
    userPrefsModal.setUserPrefs(prefs);
  }
  function getUserPrefChanges() {
    return userPrefsModal.collectUserPrefs();
  }
  function setIsHost(isHost) {
    userPrefsModal.setIsHost(isHost);
  }

  return {
    onPrefsOpen,
    onPrefsSubmit,
    setUserPrefs,
    getUserPrefChanges,
    setIsHost
  }
}