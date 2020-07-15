export default function UserPrefsController(isLoggedIn, userPrefsProviderThunk, userPrefsView) {
  let prefs;
  function ready() {
    _setupListeners();
    console.log("User prefs controller ready, is logged in", isLoggedIn);
    if (isLoggedIn) {
      console.log("getting user prefs");
      userPrefsProviderThunk().fetchUserPrefs();
    }
  }
  function getUserNickname() {
    return prefs.nickname;
  }
  function setIsHost(isHost) {
    userPrefsView.setIsHost(isHost);
  }
  function _setupListeners() {
    userPrefsProviderThunk().onGetUserPrefs((_prefs) => {
      prefs = _prefs;
      userPrefsView.setUserPrefs(prefs);
    });
    userPrefsView.onPrefsOpen(() => {
      if (isLoggedIn) {
        userPrefsProviderThunk().fetchUserPrefs();
      }
    });
    userPrefsView.onPrefsSubmit((_prefs) => {
      prefs = _prefs;
      if (isLoggedIn) {
        userPrefsProviderThunk().saveUserPrefs(prefs);
      }
    });
  }

  return {
    ready, getUserNickname, setIsHost
  }
}