// Shows modal dialog
function showAlert(text, title = "Alert", buttonText = "OK") {
    $("#modal .modal-title").text(title);
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