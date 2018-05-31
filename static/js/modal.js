// Shows modal dialog
// Type=Success, Failure
function showAlert(text, title = "Alert", buttonText = "OK", type="Success") {

    switch(type){
        case "Failure":
            $("#modal h5").addClass("modal-title-failure");
            $("#modal h5").removeClass("modal-title-success");
            break;
        default:
            $("#modal h5").addClass("modal-title-success");
            $("#modal h5").removeClass("modal-title-failure");
    }

    $("#modal h5").text(title);
    $("#modal .modal-body p").html(text);
    $("#modal-button").text(buttonText);
    $("#modal").show();
}

function modalClose() {
    $("#modal").hide();
}

$(document).ready(function () {
    $("#modal .close").click(function () {
        modalClose();
    });
    $("#modal-button").click(function () {
        modalClose();
    });
});