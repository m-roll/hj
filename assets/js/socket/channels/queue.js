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

    addSong(access_token, url) {
        this.queueChannel.push('queue:add', {
            songInput: url,
            spotifyAccessToken: access_token,
            user: "Anonymous user"
        });
    }

    fetch() {
        let res = this.queueChannel.push('queue:fetch');
        console.log(res);
        return res;
    }
}