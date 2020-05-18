export default class RoomController {
  constructor(joinRoomView, joinRoomErrorView, roomRegistryThunk, setupRoomCb) {
    this.setupRoomCb = setupRoomCb;
    this.roomRegistryThunk = roomRegistryThunk;
    roomRegistryThunk().onRoomExists(this._setupRooms.bind(this));
    roomRegistryThunk().onRoomNotFound(joinRoomErrorView.showRoomNotFoundError.bind(joinRoomErrorView));
    joinRoomView.onJoinRoom(((roomCode) => {
      history.pushState({}, document.title, roomCode);
      this.tryJoinRoom(roomCode);
    }).bind(this));
    if (typeof hj_room_code !== 'undefined' && hj_room_code !== null) {
      this.tryJoinRoom(hj_room_code);
    } else {
      joinRoomView.init();
    }
  }
  tryJoinRoom(roomCode) {
    this.roomRegistryThunk().checkExists(roomCode);
  }
  _setupRooms(roomCode) {
    this.roomCode = roomCode;
    this.setupRoomCb(roomCode);
  }
  getRoomCode = () => this.roomCode;
}