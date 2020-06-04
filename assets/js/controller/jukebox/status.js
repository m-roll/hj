export default class StatusController {
  constructor(statusView, statusProducerThunk, roomCodeThunk) {
    this.statusView = statusView;
    this.statusProducerThunk = statusProducerThunk;
    this.roomCodeThunk = roomCodeThunk;
  }
  ready() {
    this.statusProducerThunk().getCurrent(this.roomCodeThunk(), this.statusView.updateStatusView.bind(this.statusView));
    this.statusProducerThunk().onSongStatusUpdate((update) => {
      console.log("playback updated!")
      this.statusView.updateStatusView(update);
    });
  }
}