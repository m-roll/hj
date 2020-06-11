export const mockRedirectHome = () => {
  history.pushState({}, document.title, '/');
  if (hj_has_room_code) {
    hj_room_code = null;
  }
}