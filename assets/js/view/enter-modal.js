import $ from 'jquery'; // let's keep jquery out of other stuff
export default class EnterModal {
  constructor() {
    this.modalElement = $('#enter-modal');
  }
  init() {
    $('#enter-modal').modal({
      backdrop: "static",
      keyboard: false,
      focus: true,
      show: true
    });
  }
  onCreateRoom(cb) {
    $('#enter-modal-room-create').click(e => {
      cb();
    })
  }
  onJoinRoom(cb) {
    const dismiss = () => {
      $('#enter-modal').modal('hide');
    }
    $('#enter-modal-room-join').click(e => {
      let roomCode = $('#enter-modal-room-code').val();
      $('#enter-modal-room-code').val('');
      cb(roomCode);
      dismiss();
    });
  }
}