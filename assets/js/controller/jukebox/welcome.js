export default function WelcomeController(welcomeView) {
  const cookieKey = "hj.doNotWelcome";
  welcomeView.onWelcomeFormSubmit((doNotPrompt) => {
    console.log("do not prompt:", doNotPrompt);
    if (doNotPrompt) {
      let cookieEntry = cookieKey + "=" + new String(doNotPrompt);
      console.log("New cookie: ", cookieEntry);
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