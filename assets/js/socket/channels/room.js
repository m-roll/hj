export default class RoomChannel {
  constructor(socket) {
    this.roomChannel = socket.channel("room", {});
  }
  join() {
    this.roomChannel.join().receive("ok", resp => {
      console.log("Joined room channel successfully", resp)
    }).receive("error", resp => {
      console.log("Unable to join room channel", resp)
    })
  }
  onRoomExists(cb) {
    this.onRoomExists = cb;
  }
  onRoomNotFound(cb) {
    this.onRoomNotFound = cb;
  }
  checkExists(roomCode) {
    this.roomChannel.push('room:exists', {
      roomCode
    }).receive("ok", res => {
      if (res["created"]) {
        this.onRoomExists(res["room_code"]);
      } else {
        this.onRoomNotFound(roomCode);
      }
    });
  }
}