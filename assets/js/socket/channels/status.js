export default function StatusChannel(socket, ...args) {
  let roomCode = args[0];
  let statusChannel = socket.channel("status:" + roomCode, {});

  function onSongStatusUpdate(songPlayingCb) {
    statusChannel.on('status:play', songPlayingCb);
  }
  function join() {
    statusChannel.join().receive("ok", resp => {
      console.log("Joined status channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join status channel", resp)
    })
  }
  function getCurrent(roomCode, cb) {
    statusChannel.push('status:current').receive("ok", cb);
  }

  return {
    onSongStatusUpdate,
    join,
    getCurrent
  }
}