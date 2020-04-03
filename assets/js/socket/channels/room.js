export default class RoomChannel {
    constructor(socket) {
        this.roomChannel = socket.channel("room", {});
    }

    join() {
        this.roomChannel.join()
            .receive("ok", resp => { console.log("Joined room channel successfully", resp) })
            .receive("error", resp => { console.log("Unable to join room channel", resp) })
    }

    checkExists(roomCode, roomCb, noRoomCb) {
        this.roomChannel.push('room:exists', { roomCode })
            .receive("ok", res => {
                if (res["created"]) {
                    roomCb(res["room_code"]);
                } else {
                    noRoomCb();
                }
            });
    }
}