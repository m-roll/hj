export default class QueueChannel {

    constructor(socket) {
        this.queueChannel = socket.channel("queue", {});
    }

    onSongProcessed(songProcessedCb) {
        this.queueChannel.on('song:processed', songProcessedCb);
    }

    onQueuePop(popCb) {
        this.queueChannel.on('queue:pop', popCb);
    }

    join() {
        this.queueChannel.join()
            .receive("ok", resp => { console.log("Joined queue channel successfully", resp) })
            .receive("error", resp => { console.log("Unable to join queue channel", resp) })
    }

    addSong(roomCode, url) {
        this.queueChannel.push('queue:add:' + roomCode, {
            songInput: url,
            user: "Anonymous user"
        });
    }

    fetch(roomCode, fetchCb) {
        let req = this.queueChannel.push('queue:fetch:' + roomCode);
        req.receive("ok", fetchCb);
        return req;
    }
}