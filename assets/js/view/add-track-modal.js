import $ from 'jquery'; // let's keep jquery out of other stuff
export default class AddTrackModal {
  constructor() {
    this.modalElement = $('#add-track-modal');
  }
  init() {
    $('#add-track-modal').modal({
      backdrop: "static",
      keyboard: true,
      focus: true,
      show: false
    });
  }
  show() {
    $('#add-track-modal').modal('show');
  }
  onAddTrack(cb) {
    $('#submit-button').click(e => {
      let songInput = document.getElementById("song-input");
      cb(songInput.value);
    });
  }
  dismiss() {
    $('#add-track-modal').modal('hide');
  }
}