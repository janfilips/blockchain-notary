var _button1call;
var _button2call;

// Shows modal dialog
// Type=Success, Failure
function showAlert(text, title = "Alert", button1Text = "OK", button2Text = null, button1call = modalClose, button2call = null, type = "Success", socialMedia = false) {

    $(".modal-body #email").hide();

    _button1call = button1call;
    _button2call = button2call;

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

    if (socialMedia == true) {
        $(".share-buttons").show();
    }
    else {
        $(".share-buttons").hide();
    }

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
    $(".modal-body #email").remove();
    $("#modal").hide();
}

function manageEmailBox() {
    if (!$(".modal-body input:last-child").is("#email")) {
        $(".modal-body").append('<input id="email" type="email" placeholder="Enter your e-mail" required="required" />');
        $("#modal-button-2").text("Send");
        $("#modal-button-1").text("Cancel");
    }
}

function sendMailAjax() {
    $.ajax({
        type: "POST",
        url: '/ajax/send-mail/',
        dataType: 'json',
        headers: {
            'X-CSRFToken': csrf_token
        },
        cache: 'false',
        data: {
            mail_body: "test",
            mail_to: $(".modal-body #email").val(),
            transaction_hash: "hash"
        },
        success: function (response) {
            switch (response.result) {
                case "true":
                    console.log("E-mail sucessfully send");
                    showAlert("Notarising informations was sucessfully send to entered e-mail address", "E-mail send");
                    break;
                default:
                    console.log("E-mail has not been send (Django error)");
                    showAlert("An internal error occured. We can not send e-mail to entered address. Use link profided instead", "An error occured", "OK", null, modalClose, null, "Failure");

            }
        },
        error: function () {
            console.log("E-mail has not been send (Ajax error)");
            showAlert("An internal error occured. We can not send e-mail to entered address. Use link profided instead", "An error occured", "OK", null, modalClose, null, "Failure");
        }
    });
}

$(document).ready(function () {
    $("#modal .close").click(function () {
        modalClose();
    });
    $("#modal-button-1").click(function () {
        window["_button1call"]();
    });
    $("#modal-button-2").click(function () {
        if ($("#modal-button-2").text() == "Send via e-mail") {
            window["_button2call"]();
        }
        else if ($("#modal-button-2").text() == "Send") {
            if ($(".modal-body #email").val() != "") {
                sendMailAjax();
                modalClose();
            }
            else{
                $(".modal-body #email").val("your@email.com");
            }
        }
    });
});