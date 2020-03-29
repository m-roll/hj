export default class StatusChannel {

    constructor(socket) {
        this.statusChannel = socket.channel("status", {});
    }

    onSongStatusUpdate(roomCode, songPlayingCb) {
        this.statusChannel.on('status:play:' + roomCode, songPlayingCb);
    }

    join() {
        this.statusChannel.join()
            .receive("ok", resp => { console.log("Joined status channel successfully", resp) })
            .receive("error", resp => { console.log("Unable to join status channel", resp) })
    }

    getCurrent(roomCode, cb) {
        this.statusChannel.push('status:current:' + roomCode)
            .receive("ok", cb);
    }
}