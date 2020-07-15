export default function StatusController(statusView, statusProducerThunk, roomCodeThunk) {
  function ready() {
    statusProducerThunk().getCurrent(roomCodeThunk(), statusView.updateStatusView);
    statusProducerThunk().onSongStatusUpdate((update) => {
      statusView.updateStatusView(update);
    });
  }

  return {
    ready
  }
}