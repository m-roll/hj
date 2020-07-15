export default function RoomCodeView() {
  let roomCodeElement = document.getElementById("code-disp");
  let roomCodeLabel = document.getElementById("code-disp-label");
  function setRoomCode(roomCode) {
    roomCodeElement.textContent = roomCode;
    roomCodeLabel.classList.remove("hidden");
  }

  return {
    setRoomCode
  }
}