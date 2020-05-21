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
  }

  _render(deviceList) {
    return (<div id="device-list-group" className="device-list-group list-group">
      {deviceList.map(device =>
        (<div className="list-group-item">
          <div className="row">
            <div className="col device-meta">
              <div className="row mb-1">
                <button value={device["id"]}><p id="device-name" className="my-auto font-weight-bold">{device["name"]}</p></button>
              </div>
            </div>
          </div>
        </div>)
      )
      }
    </div>)
  }
}