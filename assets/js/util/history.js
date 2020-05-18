export const mockRedirectHome = () => {
  history.pushState({}, document.title, '/');
  hj_room_code = null;
}