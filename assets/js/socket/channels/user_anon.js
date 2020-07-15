export default function UserAnonChannel(socket, ...args) {
  let roomCode = args[0];
  let userChannel = socket.channel("user_anon:" + roomCode, {});
  let onGetVoteStatusCb;

  function onSkipStateUpdate(cb) {
    //{num_skips: , skips_needed: }
    userChannel.on("user_anon:skip_state", cb);
  }
  function voteSkip() {
    userChannel.push('user_anon:vote_skip').receive("ok", resp => {
      onGetVoteStatusCb(resp);
    })
  }
  function unVoteSkip() {
    userChannel.push('user_anon:unvote_skip').receive("ok", resp => {
      onGetVoteStatusCb(resp);
    })
  }
  function onGetVoteStatus(cb) {
    onGetVoteStatusCb = cb;
  }
  function getVoteStatus(cb) {
    userChannel.push('user_anon:vote_status').receive("ok", onGetVoteStatusCb);
  }
  function join() {
    userChannel.join().receive("ok", resp => {
      console.log("Joined anon user channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join anon user channel", resp)
    })
  }
  function onGetUserPrefs(cb) {
    onGetUserPrefsCb = cb;
  }
  function fetchUserPrefs() {
    userChannel.push("user_anon:prefs_get").receive("ok", resp => {
      onGetUserPrefsCb(resp);
    }).receive("error", resp => {
      console.warn("error retrieving user preferences", resp);
    });
  }

  return {
    onSkipStateUpdate,
    voteSkip,
    unVoteSkip,
    onGetVoteStatus,
    getVoteStatus,
    join,
    onGetUserPrefs,
    fetchUserPrefs
  }
}