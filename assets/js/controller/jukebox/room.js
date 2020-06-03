export default class RoomController {
  constructor(joinRoomView, joinRoomErrorView, roomRegistryThunk) {
    this.joinRoomView = joinRoomView;
    this.joinRoomErrorView = joinRoomErrorView;
    this.roomRegistryThunk = roomRegistryThunk;
  }
  ready() {
    this.roomRegistryThunk().onRoomExists(this._setupRooms.bind(this));
    this.roomRegistryThunk().onRoomNotFound(this.joinRoomErrorView.showRoomNotFoundError.bind(this.joinRoomErrorView));
    this.joinRoomView.onJoinRoomSubmit(((roomCode) => {
      this.tryJoinRoom(roomCode);
    }).bind(this));
    if (typeof hj_room_code !== 'undefined' && hj_room_code !== null) {
      // this is if the room code is set via the URL
      this.tryJoinRoom(hj_room_code);
    } else {
      this.joinRoomView.promptJoin();
    }
  }
  onRoomJoined(cb) {
    this.setupRoomCb = cb;
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