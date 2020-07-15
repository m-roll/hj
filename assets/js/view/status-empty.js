const overlayId = "preview-container-overlay";
export default function StatusEmptyView() {
  let overlayDom = document.getElementById(overlayId);
  function show() {
    overlayDom.hidden = false;
  }
  function hide() {
    overlayDom.hidden = true;
  }

  return {
    show, hide
  }
}