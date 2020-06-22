import {
  ready
} from "jquery"
export default class QueueController {
  constructor(roomCodeThunk, queueProducerThunk, queueReceiverThunk, userPrefsProviderThunk, queueView, statusView) {
    this.roomCodeThunk = roomCodeThunk;
    this.queueProducerThunk = queueProducerThunk;
    this.queueReceiverThunk = queueReceiverThunk;
    this.userPrefsProviderThunk = userPrefsProviderThunk;
    this.queueView = queueView;
    this.statusView = statusView;
  }
  ready() {
    console.log("Queueview", this.queueView);
    this.queueProducerThunk().onSongProcessed(this.roomCodeThunk(), this.queueView.addToQueueDisplay.bind(this.queueView));
    this.queueProducerThunk().onQueuePop(this.roomCodeThunk(), this.queueView.pop);
    this.queueProducerThunk().fetch(this.roomCodeThunk());
    this.queueProducerThunk().onQueueEmpty(() => {
      this.statusView.setEmpty();
    });
  }
  addSong(url) {
    this.queueReceiverThunk().addSong(this.roomCodeThunk(), url, this._getUserNickname());
  }
  _getUserNickname() {
    return this.userPrefsProviderThunk().getUserNickname();
  }
}