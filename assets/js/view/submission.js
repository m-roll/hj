export default class SubmissionView {
    constructor(submitCb) {
        let songInput = document.getElementById("song-input");
        let submitBtn = document.getElementById("submit-button");
        submitBtn.addEventListener("click", e => {
            submitCb(songInput.value);
            songInput.value = ""
        });
    }
}