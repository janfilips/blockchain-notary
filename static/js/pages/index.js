var lastHistoryResponse;

$(document).ready(function () {

    csrf_token = $("[name=csrfmiddlewaretoken]").val();

    /*-- tabs --*/
    $('.tabs a').click(function () {
        var tablink = $(this).attr('id');

        if ($(this).hasClass('inactive')) {
            $('.tabs a').addClass('inactive');
            $(this).removeClass('inactive');

            $('.content-tab').hide();
            $('#' + tablink + 'C').fadeIn('slow');
        }
    });

    /*--- scroll page ---*/
    $('.scrollink[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 600);
        }
    });

    getTransactionHistoryAjax();
    window.setInterval(function () {
        getTransactionHistoryAjax();
    }, 10000);

});

function getTransactionHistoryAjax() {
    $.ajax({
        type: "POST",
        url: '/ajax/history/list/',
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function (response) {
            switch (response.result) {
                case "true":
                    console.log("Transaction history was sucessfully loaded…");
                    if(response!=lastHistoryResponse){
                        //alert("změna");
                    }
                    lastHistoryResponse=(response);
                    console.log(lastHistoryResponse);
                    break;
                default:
                    console.log("Transaction history was not been loaded… (Exception while getting from database)");
            }
        },
        error: function () {
            console.log("Transaction history was not been loaded… (Ajax exception)");
        }
    });
}