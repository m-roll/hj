import {
  ready
} from "jquery"
export default class QueueController {
  constructor(roomCodeThunk, queueProducerThunk, queueReceiverThunk, queueView) {
    this.roomCodeThunk = roomCodeThunk;
    this.queueProducerThunk = queueProducerThunk;
    this.queueReceiverThunk = queueReceiverThunk;
    this.queueView = queueView;
  }
  ready() {
    this.queueProducerThunk().onSongProcessed(this.roomCodeThunk(), this.queueView.addToQueueDisplay.bind(this.queueView));
    this.queueProducerThunk().onQueuePop(this.roomCodeThunk(), this.queueView.pop);
    this.queueProducerThunk().fetch(this.roomCodeThunk());
  }
  addSong(url) {
    this.queueReceiverThunk().addSong(this.roomCodeThunk(), url);
  }
}