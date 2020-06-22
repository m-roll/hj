/** @jsxRuntime classic */

import React from '../../util/react-polyfill.js';
import { getArtistString } from '../../util/artist.js';
import $ from 'jquery';
const searchListGroupId = "search-list-group";
const fillerResultsLength = 10;
export default class SearchResultsView {

  showLoading() {
    this._update(() => { return this._renderSpinner(fillerResultsLength) });
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
      </div>);
  }

  _renderSpinner(len) {
    return (
      <div id="search-list-group" className="search-list-group list-group">
        {[...Array(len)].map((ind) => {
          return (<div className="list-group-item btn-list-item">
            <button className="btn btn-list-button search-result-add blank">
              <div className="row">
                <div className="col-2 search-result-album-cover blank">
                  <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" />
                </div>
                <div className="col search-result-meta">
                  <div className="row mb-1">
                    <p className="my-auto font-weight-bold status-song-title blank"></p>
                  </div>
                  <div className="row">
                    <p className="my-auto status-song-artist blank"></p>
                  </div>
                </div>
              </div>
            </button>
          </div>)
        })}
      </div>)
  }
}