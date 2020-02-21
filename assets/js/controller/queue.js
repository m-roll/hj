import QueueView from "../view/queue";
import JukeboxSocket from "../socket/socket";
import SubmissionView from "../view/submission";

export default class QueueController {
    submissionView;
    socket;
    queueView = new QueueView();

    constructor() {
        this.socket = new JukeboxSocket(this.onSongAdded.bind(this), null, null, ["QUEUE"]);
        let that = this;
        this.submissionView = new SubmissionView((url) => {
            //lexical binding - can we get around this?
            this.addSong.apply(that, [url]);
        });
    }

    onSongAdded(newSong) {
        this.queueView.addToQueueDisplay(newSong);
        this.statusView.updateStatusView(newSong);
    }

    addSong(url) {
        this.socket.addSong.apply(this.socket, [this.spotify_access_token, url]);
    }
}