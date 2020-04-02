export default class QueueChannel {

    constructor(socket) {
        this.queueChannel = socket.channel("queue", {});
    }

    onSongProcessed(roomCode, songProcessedCb) {
        console.log('song:processed:' + roomCode);
        this.queueChannel.on('song:processed:' + roomCode, songProcessedCb);
    }

    onQueuePop(roomCode, popCb) {
        this.queueChannel.on('queue:pop:' + roomCode, popCb);
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