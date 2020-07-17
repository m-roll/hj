export default function QueueChannel(socket, ...args) {
  let roomCode = args[0];
  const queueChannel = socket.channel("queue:" + roomCode, {});
  function onSongProcessed(roomCode, songProcessedCb) {
    queueChannel.on('song:processed', songProcessedCb);
  }
  function onQueuePop(roomCode, popCb) {
    queueChannel.on('queue:pop', popCb);
  }
  function onQueueEmpty(cb) {
    queueChannel.on('queue:empty', cb);
  }
  function join() {
    queueChannel.join().receive("ok", resp => {
      console.log("Joined queue channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join queue channel", resp)
    })
  }
  function addSong(roomCode, url, nickname) {
    queueChannel.push('queue:add', {
      songInput: url,
      user: nickname
    });
  }
  function fetch(fetchCb) {
    let req = queueChannel.push('queue:fetch');
    req.receive("ok", fetchCb);
    return req;
  }

  return {
    onSongProcessed,
    onQueuePop,
    onQueueEmpty,
    join,
    addSong,
    fetch
  }
}