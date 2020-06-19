/** @jsxRuntime classic */

import React from '../../util/react-polyfill.js';
import { getArtistString } from '../../util/artist.js';
import $ from 'jquery';
const searchListGroupId = "modal-body-add-track";
export default class SearchResultsView {

  showLoading() {
    this._update(this._renderSpinner);
  }

  updateSearchResults(songs) {
    this._update(() => {
      return this._render(songs);
    })
  }

  _update(renderFunc) {
    let searchListGroup = document.getElementById(searchListGroupId);
    let newDom = renderFunc();
    searchListGroup.parentNode.replaceChild(newDom, searchListGroup);
  }

  _render(songs) {
    return (
      <div id="modal-body-add-track" className="modal-body d-flex">
        <h5 className="card-title mb-4"> Add a song </h5>
        <form id="song-search-form">
          <input type="text" name="search-query" id="search-query" className="form-control my-2" placeholder="Search for a track" />
          <button name="search-submit" type="submit" className="btn btn-secondary">Submit</button>
        </form>
        <div id="search-list-group" className="search-list-group list-group">
          {songs.map(song =>
            (<div className="list-group-item btn-list-item">
              <button className={"btn btn-list-button search-result-add"} value={song["id"]}>
                <div className="row">
                  <div className="col-2 search-result-album-cover"><img src={song["track_art_url"]} /></div>
                  <div className="col search-result-meta">
                    <div className="row mb-1">
                      <p className="my-auto font-weight-bold status-song-title">{song["track_name"]}</p>
                    </div>
                    <div className="row">
                      <p className="my-auto status-song-artist">{getArtistString(song["track_artists"])}</p>
                    </div>
                  </div>
                </div>
              </button>
            </div>)
          )
          }
        </div>
      </div>);
  }

  _renderSpinner() {
    return (<div id="modal-body-add-track" className="modal-body d-flex">
      <h5 className="card-title mb-4"> Add a song </h5>
      <form id="song-search-form">
        <input type="text" name="search-query" id="search-query" className="form-control my-2" placeholder="Search for a track" />
        <button name="search-submit" type="submit" className="btn btn-secondary">Submit</button>
      </form>
      <div className="d-flex spinner-holder"><i className="fas fa-spinner search-spinner"></i></div>
    </div>)
  }
}