export function AddTrackController(addTrackView, searchControllerThunk, getRoomCodeThunk) {
  let addSongCb;
  _setupListeners(addTrackView, searchControllerThunk, getRoomCodeThunk);
  function onSongSubmit(addSongCb) {
    addSongCb = addSongCb;
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
}