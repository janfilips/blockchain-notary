// Shows modal dialog
// Type=Success, Failure
function showAlert(text, title = "Alert", button1Text = "OK", button2Text=null, button1call=modalClose, button2call=null, type="Success") {

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
    $("#modal-button-1").text(button1Text);
    $("#modal").show();

    // Show/hide button 2
    if(button2Text!=null){
        $("#modal-button-2").text(button2Text);
        $("#modal-button-2").show();
    }
    else{
        $("#modal-button-2").hide();
    }
}

function modalClose() {
    $("#modal").hide();
}

$(document).ready(function () {
    $("#modal .close").click(function () {
        modalClose();
    });
    $("#modal-button-1").click(function () {
        modalClose();
    });
});