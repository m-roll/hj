import $ from "jquery"; // let's keep jquery out of other stuff
export default class EnterModal {
    constructor() {
        this.modalElement = $('#enter-modal');
    }

    init() {
        $('#enter-modal').modal({
            backdrop: "static",
            keyboard: false,
            focus: true,
            show: true
        });
    }

    onCreateRoom(cb) {
        $('#enter-modal-room-create').click(e => {
            cb();
        })
    }

    dismiss() {
        $('#enter-modal').modal('hide');
    }
}