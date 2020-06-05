/** @jsxRuntime classic */
import $ from "jquery";
import React from '../../util/react-polyfill.js';
const deviceListGroupId = "device-list-group";
export default class DeviceListView {
  constructor() {

  }

  updateDevices(devices) {
    let deviceListGroup = document.getElementById(deviceListGroupId);
    let newDom = this._render(devices);
    deviceListGroup.parentNode.replaceChild(newDom, deviceListGroup);
    this._updateListeners();
  }

  onSelectDevice(cb) {
    console.log('set change device cb');
    this.buttonClickCb = cb;
  }

  _updateListeners() {
    $('.btn-device').on("click", (e) => {
      this.buttonClickCb(e.currentTarget.value);
    });
  }

  _render(deviceList) {
    return (<div id="device-list-group" className="device-list-group list-group">
      {deviceList.map(device =>
        (<div className="list-group-item">
          <div className="row">
            <div className="col device-meta">
              <div className="row mb-1">
                <button className={"btn btn-device " + (device["is_active"] ? "btn-device-active" : "")} value={device["id"]}>
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
              </div>
            </div>
          </div>
        </div>)
      )
      }
    </div>)
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
      default: return "headphones-alt";
    }
  }
}