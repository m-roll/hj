import RoomNotFoundModal from "../view/modal/room-nf-modal.js";
import {
  mockRedirectHome
} from "../util/history.js";
export default function RoomNotFoundView(joinRoomView) {
  let roomNfModal = new RoomNotFoundModal();
  _setupRoomNfModal();

  function showRoomNotFoundError() {
    roomNfModal.show();
  }

  function _setupRoomNfModal() {
    roomNfModal.init();
    roomNfModal.onAccept(() => {
      roomNfModal.dismiss();
      mockRedirectHome();
      joinRoomView.promptJoin();
    });
  }

  return {
    showRoomNotFoundError
  }
}