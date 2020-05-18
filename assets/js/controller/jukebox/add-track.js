export default class AddTrackController {
  constructor(addTrackView, searchControllerThunk, getRoomCodeThunk) {
    this._setupListeners(addTrackView, searchControllerThunk, getRoomCodeThunk);
  }
  onSongSubmit(addSongCb) {
    this.addSongCb = addSongCb;
  }
  _setupListeners(addTrackView, searchControllerThunk, getRoomCodeThunk) {
    addTrackView.init();
    addTrackView.onSearchQuerySubmit((query) => {
      searchControllerThunk().query(getRoomCodeThunk(), query, addTrackView.populateSearchResults.bind(addTrackView))
    });
    addTrackView.onAddTrack(((songUri) => {
      this.addSongCb(songUri);
      addTrackView.dismiss();
    }).bind(this));
  }
}