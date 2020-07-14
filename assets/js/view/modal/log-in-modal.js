import $ from 'jquery';
export default class LogInModal {
  constructor() {
    $('#log-in-modal').modal({
      backdrop: true,
      keyboard: true,
      focus: false,
      show: false
    });
    document.getElementById("log-in-modal-dismiss").addEventListener("click", (e) => {
      $('#log-in-modal').modal('hide');
    });
  }
  show() {
    $('#log-in-modal-button').attr("href", "/authorize?room_code=" + hj_room_code);
    $('#log-in-modal').modal('show');
  }
}