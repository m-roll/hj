export default function HostsController(hostProviderThunk, hostView) {
  function ready() {
    hostProviderThunk().onHostUpdated(() => {
      hostProviderThunk().checkIsHost(((hostInfo) => {
        onUpdateHostStatusCb(hostInfo);
        _updateHostInfo(hostInfo);
      }));
    });
  }
  function onUpdateHostStatus(cb) {
    onUpdateHostStatusCb = cb;
  }
  function _updateHostInfo(hostInfo) {
    if (hostInfo) {
      hostView.show();
    }
  }
  return {
    ready,
    onUpdateHostStatus
  }
}