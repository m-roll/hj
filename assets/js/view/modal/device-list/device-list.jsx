/** @jsxRuntime classic */
import $ from "jquery";
import React from '../../util/react-polyfill.js';
const modalCardGroupId = "device-list-modal-body";
export default class DeviceListView {
  constructor() {

  }

  updateDevices(devices) {
    this._update((() => {
      return this._renderDevices(devices);
    }).bind(this));
    this._updateListeners();
  }

  onSelectDevice(cb) {
    this.buttonClickCb = cb;
  }

  hasNoDevices() {
    this._update(this._renderNoDevices);
  }

  onDismiss(cb) {
    this.onDismissCb = cb;
  }

  onMute(cb) {
    this.onMuteCb = cb;
  }

  _updateListeners() {
    $('.btn-device').on("click", (e) => {
      if (e.currentTarget.value === 'none') {
        this.onMuteCb();
      } else {
        this.buttonClickCb(e.currentTarget.value);
      }
    });
  }

  _update(renderFun) {
    let deviceListGroup = document.getElementById(modalCardGroupId);
    let newDom = renderFun();
    deviceListGroup.parentNode.replaceChild(newDom, deviceListGroup);
    $('#' + modalCardGroupId).fadeIn();
    $('#device-list-close-btn').click((e => {
      this.onDismissCb();
      $('#' + modalCardGroupId).fadeOut();
    }).bind(this));
  }

  _renderDevices(deviceList) {
    console.log("rendering devices", deviceList);
    return (
      <div id="device-list-modal-body" className="modal-body">
        <h5 class="card-title mb-4"> Select playback device </h5>
        <div id="device-list-group" className="device-list-group list-group">
          {deviceList.map(device =>
            (<div className="list-group-item btn-list-item">
              <button className={"btn btn-list-button btn-device " + (device["is_active"] ? "btn-device-active" : "")} value={device["id"]}>
                <div className="row">
                  <div className="col-2">
                    <div className="row device-icon-holder d-flex">
                      <i className={"fas fa-" + this._getFaIconForDeviceType(device["type"]) + " device-icon"}></i>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row">
                      <span className="device-name">{device["name"]}</span>
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

  _renderNoDevices() {
    return (
      <div id="device-list-modal-body" className="modal-body">
        <h5 class="card-title mb-4"> Launch Spotify </h5>
        <div className="col">
          <div className="row">
            <p>Please launch Spotify on one of your devices. Once you do, you will have the option to connect to it here.</p>
          </div>
        </div>
        <button id="device-list-close-btn" type="button" className="btn btn-secondary">Okay</button>
      </div>);
  }

  //if changing this list, make sure the necessary icons are registered with FA in app.js
  _getFaIconForDeviceType(deviceType) {
    switch (deviceType.toLowerCase()) {
      case "tablet": return "tablet";
      case "computer": return "laptop";
      case "smartphone": return "mobile";
      //case "tv": return "television";
      //case "audiodongle": return "bluetooth";
      //case "castvideo": return "feed";
      //case "castaudio": return "feed";
      case "automobile": return "car";
      case "mute": return "volume-mute";
      default: return "headphones-alt";
    }
  }
}