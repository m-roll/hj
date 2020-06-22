export default class UserPrefsController {
  prefs;
  constructor(isLoggedIn, userPrefsProviderThunk, userPrefsView) {
    this.isLoggedIn = isLoggedIn;
    this.userPrefsProviderThunk = userPrefsProviderThunk;
    this.userPrefsView = userPrefsView;
  }
  ready() {
    this._setupListeners();
  }
  getUserNickname() {
    return this.prefs.nickname;
  }
  _setupListeners() {
    this.userPrefsProviderThunk().onGetUserPrefs(this.userPrefsView.setUserPrefs.bind(this.userPrefsView));
    this.userPrefsView.onPrefsOpen((() => {
      if (this.isLoggedIn) {
        this.userPrefsProviderThunk().fetchUserPrefs();
      }
    }).bind(this));
    this.userPrefsView.onPrefsSubmit(((prefs) => {
      this.prefs = prefs;
      console.log(this.isLoggedIn)
      if (this.isLoggedIn) {
        this.userPrefsProviderThunk().saveUserPrefs(prefs);
      }
    }).bind(this));
  }
}