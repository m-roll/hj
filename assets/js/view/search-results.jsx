import { ReactPolyfill as React } from 'view/util/react-polyfill.js';
import { getArtistString } from 'view/util/artist.js';

export default class SearchResultsView {
  searchListGroupId = "search-list-group";

  updateSearchResults(songs) {
    let searchListGroup = document.getElementById(this.searchListGroupId);
    let parent = searchListGroup.parent;
    parent.removeChild(searchListGroup);
    parent.appendChild(_getSearchDom(songs));
  }

  _getSearchDom(songs) {
    return (
      <div id="search-list-group" class="list-group">
        {songs.map(song => {
          (<div class="list-group-item">
            <div class="row">
              <div class="col-2 search-result-album-cover"><img src={song["track_art_url"]} /></div>
              <div class="col-8 search-result-meta">
                <div class="row mb-1">
                  <p id="status-song-title" class="my-auto font-weight-bold">{song["name"]}}</p>
                </div>
                <div class="row">
                  <p id="status-song-artist" class="my-auto ">{getArtistString(song["artists"])}</p>
                </div>
              </div>
              <div class="col-2 search-result-add"><button class="btn btn-primary" value={song["id"]}>+</button></div>
            </div>
          </div>)
        })}
      </div >);
  }
}