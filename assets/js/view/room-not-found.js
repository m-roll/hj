import RoomNotFoundModal from "../view/modal/room-nf-modal.js";
import {
  mockRedirectHome
} from "../util/history.js";
export default class RoomNotFoundView {
  roomNfModal = new RoomNotFoundModal();
  constructor(joinRoomView) {
    this._setupRoomNfModal();
    this.joinRoomView = joinRoomView;
  }
  _setupRoomNfModal() {
    this.roomNfModal.init();
    this.roomNfModal.onAccept((() => {
      this.roomNfModal.dismiss();
      mockRedirectHome();
      this.joinRoomView.promptJoin();
    }).bind(this));
  }
  showRoomNotFoundError() {
    this.roomNfModal.show();
  }
}