import $ from 'jquery'; // let's keep jquery out of other stuff
import {
  getInputValueFromForm
} from '../util/jquery.js';
import SearchResultsView from './add-track/search-results.jsx';
const searchFormSelector = "#song-search-form";
const modalSelector = '#add-track-modal';
const addTrackButtonSelector = '.search-result-add';
const searchFieldInputName = "search-query";
const searchTimeoutMs = 400;
export default function AddTrackModal {
  searchTimeout;
  let modalElement = $(modalSelector);
  let searchResultsView = new SearchResultsView();
  searchResultsView.updateSearchResults([]);
  _setupEvents();
  document.getElementById("add-track-button").addEventListener("click", (e) => {
    show();
  });
  function init() {
    $(modalSelector).modal({
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false
    });
    $(modalSelector).on("shown.bs.modal", (e) => {
      $('#search-query').focus();
    });
  }
  function show() {
    $(modalSelector).modal('show');
  }
  function populateSearchResults(searchResults) {
    searchResultsView.updateSearchResults(searchResults);
    _setupEvents();
    $(addTrackButtonSelector).click(e => {
      onAddTrackCb("spotify:track:" + e.currentTarget.value);
    });
  }
  function onSearchQuerySubmit(cb) {
    onSearchQuerySubmitCb = cb;
  }
  function onAddTrack(cb) {
    onAddTrackCb = cb;
  }
  function dismiss() {
    $(modalSelector).modal('hide');
  }
  function _setupEvents() {
    $(searchFormSelector).on('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      let searchQuery = getInputValueFromForm($(event.currentTarget), searchFieldInputName);
      onSearchQuerySubmitCb(searchQuery);
      searchResultsView.showLoading();
      return false;
    });
    $('#search-query').on("input", ((event) => {
      clearTimeout(searchTimeout);
      if (!event.currentTarget.focus) return;
      let searchQuery = event.currentTarget.value;
      searchResultsView.showLoading();
      searchTimeout = setTimeout(() => {
        onSearchQuerySubmitCb(searchQuery);
      }, searchTimeoutMs);
    }).bind(this));
    $('#add-modal-dismiss').click(e => {
      dismiss();
    });
  }

  return {
    init,
    show,
    populateSearchResults,
    onSearchQuerySubmit,
    onAddTrack,
    dismiss
  }
}