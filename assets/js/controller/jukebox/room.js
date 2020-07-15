export default function RoomController(joinRoomView, joinRoomErrorView, roomRegistryThunk) {
  let roomCode;
  let setupRoomCb;
  let getRoomCode = () => roomCode;
  function ready() {
    roomRegistryThunk().onRoomExists(_setupRooms);
    roomRegistryThunk().onRoomNotFound(joinRoomErrorView.showRoomNotFoundError);
    joinRoomView.onJoinRoomSubmit((roomCode) => {
      tryJoinRoom(roomCode);
    });
    if (typeof hj_room_code !== 'undefined' && hj_room_code !== null) {
      // this is if the room code is set via the URL
      tryJoinRoom(hj_room_code);
    } else {
      joinRoomView.promptJoin();
    }
  }
  function onRoomJoined(cb) {
    setupRoomCb = cb;
  }
  function tryJoinRoom(roomCode) {
    roomRegistryThunk().checkExists(roomCode);
  }
  function _setupRooms(_roomCode) {
    roomCode = _roomCode;
    setupRoomCb(roomCode);
  }

  return {
    ready, onRoomJoined, tryJoinRoom, getRoomCode
  }
}