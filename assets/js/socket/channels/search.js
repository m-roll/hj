export default class SearchChannel {
  constructor(socket, roomCode) {
    this.roomChannel = socket.channel("search:" + roomCode, {});
  }
  join() {
    this.roomChannel.join().receive("ok", resp => {
      console.log("Joined search channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join search channel", resp)
    })
  }
  query(roomCode, query, resultsCb) {
    this.roomChannel.push('search:query', {
      query: query
    }).receive("ok", (resp) => {
      resultsCb(resp["truncated_results"]);
    });
  }
}