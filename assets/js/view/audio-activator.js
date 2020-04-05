import $ from "jquery";

export default class AudioActivatorView {
    constructor() {
        this.activator = document.getElementById("audio-play-overlay");
        this.activator.classList.add("hidden");
    }

    show() {
        this.activator.classList.remove("hidden");
    }

    setContents(str) {
        $("#audio-play-overlay p").text(str);
    }

    onDismiss(cb) {
        console.log('onDismiss')
        this.activator.addEventListener("click", ((e) => {
            this.activator.parentNode.removeChild(this.activator);
            cb();
        }).bind(this))
    }
}