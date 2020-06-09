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
    this.searchResultsView.updateSearchResults([]);
    this._setupEvents();
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
    this._setupEvents();
    let that = this;
    $(addTrackButtonSelector).click(e => {
      that.onAddTrackCb("spotify:track:" + e.currentTarget.value);
    });
  }
  onSearchQuerySubmit(cb) {
    this.onSearchQuerySubmitCb = cb;
  }
  onAddTrack(cb) {
    this.onAddTrackCb = cb;
  }
  dismiss() {
    $(modalSelector).modal('hide');
  }
  _setupEvents() {
    $(searchFormSelector).on('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      let searchQuery = getInputValueFromForm($(event.currentTarget), searchFieldInputName);
      this.onSearchQuerySubmitCb(searchQuery);
      this.searchResultsView.showLoading();
      this._setupEvents();
      return false;
    });
    $('#add-modal-close-btn').click((e => {
      this.dismiss();
    }).bind(this));
  }
}