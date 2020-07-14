import $ from 'jquery'; // let's keep jquery out of other stuff
import {
  getInputValueFromForm
} from '../util/jquery';
const roomCodeInputName = "enter-modal-join-room-code";
const joinRoomFormId = 'enter-modal-join-room-form';
const modalId = 'enter-modal';
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
      $('#' + modalId).modal('hide');
    }
    $('#' + joinRoomFormId).on('submit', (event) => {
      let roomCode = getInputValueFromForm($(event.currentTarget), roomCodeInputName);
      history.pushState({}, document.title, "/room/" + roomCode);
      hj_has_room_code = true;
      hj_room_code = roomCode;
      cb(roomCode.toLowerCase());
      dismiss();
      event.preventDefault();
      event.stopPropagation();
      return false;
    })
    /*
    $('#enter-modal-room-join').click(e => {
      let roomCode = $('#enter-modal-room-code').val();
      $('#enter-modal-room-code').val('');
      history.pushState({}, document.title, roomCode);
      cb(roomCode);
      dismiss();
    });
    */
  }
}