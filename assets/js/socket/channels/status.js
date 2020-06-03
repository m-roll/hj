export default class StatusChannel {
  constructor(socket, ...args) {
    let roomCode = args[0];
    this.statusChannel = socket.channel("status:" + roomCode, {});
  }
  onSongStatusUpdate(roomCode, songPlayingCb) {
    this.statusChannel.on('status:play:' + roomCode, songPlayingCb);
  }
  join() {
    this.statusChannel.join().receive("ok", resp => {
      console.log("Joined status channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join status channel", resp)
    })
  }
  getCurrent(roomCode, cb) {
    this.statusChannel.push('status:current').receive("ok", cb);
  }
}