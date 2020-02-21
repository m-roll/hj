export default class StatusChannel {

    constructor(socket, songPlayingCb) {
        this.statusChannel = socket.channel("status", {});
        this.statusChannel.on('status:play', songPlayingCb);
    }

    join() {
        this.statusChannel.join()
            .receive("ok", resp => { console.log("Joined status channel successfully", resp) })
            .receive("error", resp => { console.log("Unable to join status channel", resp) })
    }
}