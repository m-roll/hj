export default function WelcomeController(welcomeView) {
  const cookieKey = "hj.doNotWelcome";
  welcomeView.onWelcomeFormSubmit((doNotPrompt) => {
    if (doNotPrompt) {
      let cookieEntry = cookieKey + "=" + new String(doNotPrompt);
      document.cookie = cookieEntry;
    }
  });

  function onRoomEnter() {
    console.log(document.cookie);
    if (!_getDoNotWelcomeCookie()) {
      welcomeView.show();
    }
  }

  function _getDoNotWelcomeCookie() {
    return document.cookie && ((document.cookie.split('; ').find(row => row.startsWith(cookieKey)).split('=')[1]) === 'true');
  }
  return {
    onRoomEnter
  }
}