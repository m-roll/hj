/** @jsxRuntime classic */

import React from './util/react-polyfill.js';
import { getArtistString } from './util/artist.js';

export default class SearchResultsView {
  searchListGroupId = "search-list-group";

  updateSearchResults(songs) {
    let searchListGroup = document.getElementById(this.searchListGroupId);
    let newDom = this._getSearchDom(songs);
    searchListGroup.parentNode.replaceChild(newDom, searchListGroup);
  }

  _getSearchDom(songs) {
    return (
      <div id="search-list-group" className="search-list-group list-group">
        {songs.map(song =>
          (<div className="list-group-item">
            <div className="row">
              <div className="col-2 search-result-album-cover"><img src={song["track_art_url"]} /></div>
              <div className="col-8 search-result-meta">
                <div className="row mb-1">
                  <p id="status-song-title" className="my-auto font-weight-bold">{song["track_name"]}</p>
                </div>
                <div className="row">
                  <p id="status-song-artist" className="my-auto ">{getArtistString(song["track_artists"])}</p>
                </div>
              </div>
              <div className="col-2 search-result-add"><button className="btn btn-primary" value={song["id"]}>+</button></div>
            </div>
          </div>)
        )}
      </div>);
  }
}