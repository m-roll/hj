const overlayId = "preview-container-overlay";
export default class StatusEmptyView {
  constructor() {
    this.overlayDom = document.getElementById(overlayId);
  }
  show() {
    this.overlayDom.hidden = false;
  }
  hide() {
    this.overlayDom.hidden = true;
  }
}