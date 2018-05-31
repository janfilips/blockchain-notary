var _button1call;
var _button2call;

// Shows modal dialog
// Type=Success, Failure
function showAlert(text, title = "Alert", button1Text = "OK", button2Text = null, button1call = modalClose, button2call = null, type = "Success") {
    
    _button1call=button1call;
    _button2call=button2call;

    switch (type) {
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
    if (button2Text != null) {
        $("#modal-button-2").text(button2Text);
        $("#modal-button-2").show();
    }
    else {
        $("#modal-button-2").hide();
    }
}

function modalClose() {
    $("#modal").hide();
}

function manageEmailBox() {
    if (!$(".modal-body input:last-child").is("#email")) {
        console.log("není e-mail");
        $(".modal-body").append('<input id="email" type="email" />');
    }
    else{
        console.log("je e-mail");
        if($(".modal-body #email").is(":visible")){
            console.log("je zobrazen");
        }
        else{
            console.log("je skryt");
        }
    }
}

$(document).ready(function () {
    $("#modal .close").click(function () {
        modalClose();
    });
    $("#modal-button-1").click(function () {
        window["_button1call"]();
    });
    $("#modal-button-2").click(function () {
        window["_button2call"]();
    });
});