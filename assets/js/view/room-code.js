export default class RoomCodeView {
  constructor() {
    this.roomCodeElement = document.getElementById("code-disp");
    this.roomCodeLabel = document.getElementById("code-disp-label");
  }
  setRoomCode(roomCode) {
    this.roomCodeElement.textContent = roomCode;
    this.roomCodeLabel.classList.remove("hidden");
  }
}