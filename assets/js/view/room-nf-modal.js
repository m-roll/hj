import $ from "jquery";
const id = "room-not-found-modal";
export default class RoomNotFoundModal {
    constructor() {
        this.modalElement = $('#' + id);
    }

    init() {
        $('#' + id).modal({
            backdrop: "static",
            keyboard: false,
            focus: true,
            show: true
        });
    }

    onAccept(cb) {
        $('#' + id + '-accept').click(e => {
            cb();
        })
    }

    dismiss() {
        $('#' + id).modal('hide');
    }
}