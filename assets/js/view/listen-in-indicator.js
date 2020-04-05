export default class ListenInAndProgressBarView {
    constructor() {
        this.indicator = document.getElementById("listen-in-indicator");
        this.progressBar = document.getElementById("listening-progress-bar");
        this.listenInLink = document.getElementById("listen-in-link");
    }

    setListening(isListening) {
        if (isListening) {
            this.indicator.classList.add("hidden");
            this.progressBar.classList.remove("hidden");
        } else {
            this.indicator.classList.remove("hidden");
            this.progressBar.classList.add("hidden");
        }
    }

    setRoomCode(roomCode) {
        this.listenInLink.setAttribute("href", "/" + roomCode + "/listen");
    }
}