export default class SearchChannel {
  constructor(socket) {
    this.roomChannel = socket.channel("search", {});
  }
  join() {
    this.roomChannel.join().receive("ok", resp => {
      console.log("Joined search channel successfully", resp)
    }).receive("error", resp => {
      console.log("Unable to join search channel", resp)
    })
  }
  query(roomCode, query, resultsCb) {
    this.roomChannel.push('room:exists', {
      roomCode,
      query
    }).receive("ok", resultsCb);
  }
}