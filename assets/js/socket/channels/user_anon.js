export default class UserAnonChannel {
  constructor(socket, ...args) {
    let roomCode = args[0];
    this.userChannel = socket.channel("user_anon:" + roomCode, {});
  }
  onSkipStateUpdate(cb) {
    //{num_skips: , skips_needed: }
    this.userChannel.on("user_anon:skip_state", cb);
  }
  voteSkip() {
    this.userChannel.push('user_anon:vote_skip').receive("ok", resp => {
      //fire and forget
    })
  }
  join() {
    this.userChannel.join().receive("ok", resp => {
      console.log("Joined anon user channel successfully", resp)
    }).receive("error", resp => {
      console.warn("Unable to join anon user channel", resp)
    })
  }
  onGetUserPrefs(cb) {
    this.onGetUserPrefsCb = cb;
  }
  fetchUserPrefs() {
    this.userChannel.push("user_anon:prefs_get").receive("ok", (resp => {
      this.onGetUserPrefsCb(resp);
    }).bind(this)).receive("error", resp => {
      console.warn("error retrieving user preferences", resp);
    });
  }
}