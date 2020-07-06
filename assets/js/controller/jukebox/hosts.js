export default class HostsController {
  constructor(hostProviderThunk, hostView) {
    this.hostProviderThunk = hostProviderThunk;
    this.hostView = hostView;
  }
  ready() {
    this.hostProviderThunk().onHostUpdated((() => {
      this.hostProviderThunk().checkIsHost(((hostInfo) => {
        this._updateHostInfo(hostInfo);
      }));
    }).bind(this));
  }
  _updateHostInfo(hostInfo) {
    if (hostInfo) {
      this.hostView.show();
    }
  }
}