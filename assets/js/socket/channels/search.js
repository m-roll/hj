export default function SearchChannel(socket, roomCode) {
  const roomChannel = socket.channel("search:" + roomCode, {});
  function join() {
    roomChannel.join().receive("ok", resp => {
      console.log("Joined search channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join search channel", resp)
    })
  }
  function query(roomCode, query, resultsCb) {
    roomChannel.push('search:query', {
      query: query
    }).receive("ok", (resp) => {
      resultsCb(resp["truncated_results"]);
    });
  }

  return {
    join, query
  }
}