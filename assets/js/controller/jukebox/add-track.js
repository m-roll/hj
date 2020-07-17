export default function AddTrackController(addTrackView, searchControllerThunk, getRoomCodeThunk) {
  let addSongCb;
  _setupListeners(addTrackView, searchControllerThunk, getRoomCodeThunk);
  function onSongSubmit(cb) {
    addSongCb = cb;
  }
  function _setupListeners(addTrackView, searchControllerThunk, getRoomCodeThunk) {
    addTrackView.init();
    addTrackView.onSearchQuerySubmit((query) => {
      searchControllerThunk().query(getRoomCodeThunk(), query, addTrackView.populateSearchResults.bind(addTrackView))
    });
    addTrackView.onAddTrack((songUri) => {
      addSongCb(songUri);
      addTrackView.dismiss();
    });
  }

  return {
    onSongSubmit
  }
}