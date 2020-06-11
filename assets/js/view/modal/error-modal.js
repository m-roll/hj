import $ from 'jquery';
export default class ErrorModal {
  constructor() {
    this.titleElement = document.getElementById("error-modal-title");
    this.contentElement = document.getElementById("error-modal-content");
    $('#error-modal').modal({
      backdrop: true,
      keyboard: true,
      focus: false,
      show: false
    });
    document.getElementById("error-modal-close-btn").addEventListener("click", (e) => {
      $('#error-modal').modal('hide');
    });
  }
  error(title, content) {
    this.titleElement.innerText = title;
    this.contentElement.innerText = content;
    $('#error-modal').modal('show');
  }
}