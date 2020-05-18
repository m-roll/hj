export default class StatusController {
  constructor(statusView, statusProducerThunk, roomCodeThunk) {
    this.statusView = statusView;
    this.statusProducerThunk = statusProducerThunk;
    this.roomCodeThunk = roomCodeThunk;
  }
  ready() {
    console.log(this.statusProducerThunk());
    this.statusProducerThunk().getCurrent(this.roomCodeThunk(), this.statusView.updateStatusView.bind(this.statusView));
    this.statusProducerThunk().onSongStatusUpdate(this.statusView.updateStatusView.bind(this.statusView));
  }
}