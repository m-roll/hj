export default class UserChannel {
    constructor(socket) {
        this.userChannel = socket.channel("user", {});
    }

    onAuthUpdate(authUpdateCb) {
        this.userChannel.on("auth:update", authUpdateCb);
    }

    register(access_token, refresh_token, deviceId) {
        this.userChannel.push('user:register', {
            spotifyAccessToken: access_token,
            spotifyRefreshToken: refresh_token,
            deviceId: deviceId
        })
    }

    join() {
        this.userChannel.join()
            .receive("ok", resp => { console.log("Joined user channel successfully", resp) })
            .receive("error", resp => { console.log("Unable to join user channel", resp) })
    }

    voteSkip() {
        this.userChannel.push("user:vote_skip");
    }

    createRoom(cb) {
        this.userChannel.push("user:create_room")
            .receive("ok", resp => {
                cb(resp);
            })
            .receive("error", resp => {
                console.log("Error creating room", resp);
            })
    }
}