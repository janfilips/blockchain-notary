// Shows modal dialog
function showAlert(text, title = "Alert", buttonText = "OK") {
    // Hide actual modal
    $('#modal').modal('hide');

    // Set modal
    $(".modal-header h5").text(title);
    $(".modal-body p").html(text);
    $(".modal-footer button").text(buttonText);

    // Show new modal
    $('#modal').modal('show');
}