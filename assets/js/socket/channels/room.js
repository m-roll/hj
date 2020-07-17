export default function RoomChannel(socket) {
  let roomChannel = socket.channel("room", {});
  function join() {
    roomChannel.join().receive("ok", resp => {
      console.log("Joined room channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join room channel", resp)
    })
  }
  function onRoomExists(cb) {
    onRoomExists = cb;
  }
  function onRoomNotFound(cb) {
    onRoomNotFound = cb;
  }
  function checkExists(roomCode) {
    roomChannel.push('room:exists', {
      roomCode
    }).receive("ok", res => {
      console.log("Trying create room", res);
      if (res["created"]) {
        onRoomExists(res["room_code"]);
      } else {
        onRoomNotFound(roomCode);
      }
    });
  }

  return {
    join,
    onRoomExists,
    onRoomNotFound,
    checkExists
  }
}