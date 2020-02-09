export default class QueueChannel {

    constructor(socket, songProcessedCb) {
        this.queueChannel = socket.channel("queue", {});
        this.queueChannel.on('song:processed', songProcessedCb);
    }

    join() {
        this.queueChannel.join()
            .receive("ok", resp => { console.log("Joined queue channel successfully", resp) })
            .receive("error", resp => { console.log("Unable to join queue channel", resp) })
    }

    add_song(url) {
        this.queueChannel.push('queue:add', {
            songInput: url,
            user: "Anonymous user"
        });
    }
}