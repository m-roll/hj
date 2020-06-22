import UserPrefsModal from "./modal/user-prefs-modal";
export default class UserPrefsView {
  constructor() {
    this.userPrefsModal = new UserPrefsModal();
    this.userPrefsModal.init();
    this.userPrefsBtn = document.getElementById("settings-button");
    this.userPrefsBtn.addEventListener("click", ((event) => {
      this.onPrefsOpenCb();
      this.userPrefsModal.show();
    }).bind(this));
  }
  onPrefsOpen(cb) {
    this.onPrefsOpenCb = cb;
  }
  onPrefsSubmit(cb) {
    this.userPrefsModal.onDismiss((() => {
      cb(this.getUserPrefChanges());
    }).bind(this));
  }
  //should only be called when fecthing pre-set data, logged-in users only.
  setUserPrefs(prefs) {
    this.userPrefsModal.setUserPrefs(prefs);
  }
  getUserPrefChanges() {
    return this.userPrefsModal.collectUserPrefs();
  }
}