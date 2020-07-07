export default class HostsController {
  constructor(hostProviderThunk, hostView) {
    this.hostProviderThunk = hostProviderThunk;
    this.hostView = hostView;
  }
  ready() {
    this.hostProviderThunk().onHostUpdated((() => {
      this.hostProviderThunk().checkIsHost(((hostInfo) => {
        this.onUpdateHostStatusCb(hostInfo);
        this._updateHostInfo(hostInfo);
      }));
    }).bind(this));
  }
  onUpdateHostStatus(cb) {
    this.onUpdateHostStatusCb = cb;
  }
  _updateHostInfo(hostInfo) {
    if (hostInfo) {
      this.hostView.show();
    }
  }
}