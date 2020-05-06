import $ from 'jquery'; // let's keep jquery out of other stuff
export default class AddTrackModal {
  searchFormSelector = "#song-search-form";
  modalSelector = '#add-track-modal';
  constructor() {
    this.modalElement = $(modalSelector);
    this.searchResultsView = new SearchResultsView();
    $('#add-modal-close-btn').click((e => {
      this.dismiss();
    }).bind(this));
  }
  init() {
    $(modalSelector).modal({
      backdrop: "static",
      keyboard: true,
      focus: true,
      show: false
    });
  }
  show() {
    $(modalSelector).modal('show');
  }
  populateSearchResults(searchResults) {
    let that = this;
    $('.search-result-add').click(e => {
      that.onAddTrackCb(this.value);
    })
  }
  onSearchQuerySubmit(cb) {
    $(searchFormSelector).submit((event) => {
      event.preventDefault();
      let keyValueInputs = event.target.serializeArray();
    });
  }
  onAddTrack(cb) {
    this.onAddTrackCb = cb;
  }
  dismiss() {
    $(modalSelector).modal('hide');
  }
}