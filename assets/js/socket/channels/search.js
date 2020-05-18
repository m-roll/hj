export default class SearchChannel {
  constructor(socket) {
    this.roomChannel = socket.channel("search", {});
  }
  join() {
    this.roomChannel.join().receive("ok", resp => {
      console.log("Joined search channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join search channel", resp)
    })
  }
  query(roomCode, query, resultsCb) {
    this.roomChannel.push('search:query:' + roomCode, {
      query: query
    }).receive("ok", (resp) => {
      resultsCb(resp["truncated_results"]);
    });
  }
}