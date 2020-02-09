export default class UserChannel {
    constructor(socket, authUpdateCb) {
        this.userChannel = socket.channel("user", {});
        this.userChannel.on("auth:update", authUpdateCb);
    }

    register(access_token, deviceId) {
        this.userChannel.push('user:register', {
            spotifyAccessToken: access_token,
            deviceId: deviceId
        })
    }

    join() {
        this.userChannel.join()
            .receive("ok", resp => { console.log("Joined user channel successfully", resp) })
            .receive("error", resp => { console.log("Unable to join user channel", resp) })
    }
}