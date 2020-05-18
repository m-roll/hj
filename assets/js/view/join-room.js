import EnterModal from "./modal/enter-modal";
export default class JoinRoomView {
  constructor() {
    this.enterModal = new EnterModal();
    this.enterModal.init();
  }
  promptJoin() {
    this.enterModal.show();
  }
  onJoinRoomSubmit(cb) {
    this.enterModal.onJoinRoomSubmit(cb);
  }
}