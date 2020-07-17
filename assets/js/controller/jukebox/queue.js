export default function QueueController(roomCodeThunk, queueProducerThunk, queueReceiverThunk, userPrefsProviderThunk, queueView, statusView) {

  function ready() {
    queueProducerThunk().onSongProcessed(roomCodeThunk(), queueView.addToQueueDisplay);
    queueProducerThunk().onQueuePop(roomCodeThunk(), queueView.pop);
    queueProducerThunk().fetch(roomCodeThunk());
    queueProducerThunk().onQueueEmpty(() => {
      statusView.setEmpty();
    });
  }
  function addSong(url) {
    queueReceiverThunk().addSong(roomCodeThunk(), url, _getUserNickname());
  }
  function _getUserNickname() {
    return userPrefsProviderThunk().getUserNickname();
  }

  return {
    ready,
    addSong
  }
}