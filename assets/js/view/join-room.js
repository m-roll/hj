import EnterModal from "./modal/enter-modal";
export default function JoinRoomView() {
  let enterModal = new EnterModal();
  enterModal.init();
  function promptJoin() {
    enterModal.show();
  }
  function onJoinRoomSubmit(cb) {
    enterModal.onJoinRoomSubmit(cb);
  }
  return {
    promptJoin,
    onJoinRoomSubmit
  }
}