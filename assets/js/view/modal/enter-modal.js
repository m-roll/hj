import $ from 'jquery'; // let's keep jquery out of other stuff
export default class EnterModal {
  constructor() {
    this.modalElement = $('#enter-modal');
  }
  init() {
    $('#enter-modal').modal({
      backdrop: "static",
      keyboard: false,
      focus: false,
      show: false
    });
  }
  show() {
    $('#enter-modal').modal('show');
  }
  onCreateRoomSubmit(cb) {
    $('#enter-modal-room-create').click(e => {
      cb();
    })
  }
  onJoinRoomSubmit(cb) {
    const dismiss = () => {
      $('#enter-modal').modal('hide');
    }
    $('#enter-modal-room-join').click(e => {
      let roomCode = $('#enter-modal-room-code').val();
      $('#enter-modal-room-code').val('');
      history.pushState({}, document.title, roomCode);
      cb(roomCode);
      dismiss();
    });
  }
}