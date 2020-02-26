export default class QueueChannel {

    constructor(socket, songProcessedCb, popCb) {
        this.queueChannel = socket.channel("queue", {});
        this.queueChannel.on('song:processed', songProcessedCb);
        this.queueChannel.on('queue:pop', popCb);
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

    fetch(fetchCb) {
        let req = this.queueChannel.push('queue:fetch');
        req.receive("ok", fetchCb);
        return req;
    }
}