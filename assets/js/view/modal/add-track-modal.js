import $ from 'jquery'; // let's keep jquery out of other stuff
import {
  getInputValueFromForm
} from '../util/jquery.js';
import SearchResultsView from './add-track/search-results.jsx';
const searchFormSelector = "#song-search-form";
const modalSelector = '#add-track-modal';
const addTrackButtonSelector = '.search-result-add';
const searchFieldInputName = "search-query";
export default class AddTrackModal {
  constructor() {
    this.modalElement = $(modalSelector);
    this.searchResultsView = new SearchResultsView();
    $('#add-modal-close-btn').click((e => {
      this.dismiss();
    }).bind(this));
    document.getElementById("add-track-button").addEventListener("click", (e) => {
      this.show();
    });
  }
  init() {
    $(modalSelector).modal({
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false
    });
  }
  show() {
    $(modalSelector).modal('show');
  }
  populateSearchResults(searchResults) {
    this.searchResultsView.updateSearchResults(searchResults);
    let that = this;
    $(addTrackButtonSelector).click(e => {
      that.onAddTrackCb("spotify:track:" + e.target.value);
    });
  }
  onSearchQuerySubmit(cb) {
    $(searchFormSelector).on('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      let searchQuery = getInputValueFromForm($(event.currentTarget), searchFieldInputName);
      cb(searchQuery);
      return false;
    });
  }
  onAddTrack(cb) {
    this.onAddTrackCb = cb;
  }
  dismiss() {
    $(modalSelector).modal('hide');
  }
}