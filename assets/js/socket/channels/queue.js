export default class QueueChannel {
  constructor(socket, ...args) {
    let roomCode = args[0]
    this.queueChannel = socket.channel("queue:" + roomCode, {});
  }
  onSongProcessed(roomCode, songProcessedCb) {
    this.queueChannel.on('song:processed:' + roomCode, songProcessedCb);
  }
  onQueuePop(roomCode, popCb) {
    this.queueChannel.on('queue:pop:' + roomCode, popCb);
  }
  onQueueEmpty(cb) {
    this.queueChannel.on('queue:empty', cb);
  }
  join() {
    this.queueChannel.join().receive("ok", resp => {
      console.log("Joined queue channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join queue channel", resp)
    })
  }
  addSong(roomCode, url, nickname) {
    this.queueChannel.push('queue:add', {
      songInput: url,
      user: nickname
    });
  }
  fetch(fetchCb) {
    let req = this.queueChannel.push('queue:fetch');
    req.receive("ok", fetchCb);
    return req;
  }
}