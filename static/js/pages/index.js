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
                    redrawHistory(response);
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

function redrawHistory(response) {

    // Re-draw certifications

    // Has items
    if (response.certifications.length > 0) {
        $(".tab-certifications tbody tr:gt(0)").remove();
        $.each(response.certifications, function (index) {
            var transactionHash = response.certifications[index].transaction_hash;
            var transactionCreated = response.certifications[index].transaction_created_at;
            var row = '<tr><td><span class="check"></span><a href="https://ropsten.etherscan.io/tx/' + transactionHash + '" aria-label="Transaction ' + transactionHash + '" target="_blank">' + transactionHash + '</a></td><td>' + transactionCreated + '</td></tr>';

            $(".tab-certifications tbody:last-child").append(row);
        });
    }

    // No items
    else {
        $(".tab-certifications tbody tr:gt(0)").remove();
        $(".tab-certifications tbody:last-child").append('<tr><td colspan=2>There are no certified documents yet…</td></tr>');
    }

    // Re-draw Ongoing Submissions

    // Has items
    if (response.ongoing_submissions.length > 0) {
        
        // Show count
        $("#tab-ongoing").text("Ongoing Submissions ("+response.ongoing_submissions.length+")");

        $(".tab-ongoing tbody tr:gt(0)").remove();
        $.each(response.ongoing_submissions, function (index) {
            var transactionHash = response.ongoing_submissions[index].transaction_hash;
            var transactionCreated = response.ongoing_submissions[index].transaction_created_at;
            var row = '<tr><td><span class="check"></span><a href="https://ropsten.etherscan.io/tx/' + transactionHash + '" aria-label="Transaction ' + transactionHash + '" target="_blank">' + transactionHash + '</a></td><td>' + transactionCreated + '</td></tr>';

            $(".tab-ongoing tbody:last-child").append(row);
        });
    }

    // No items
    else {

        // Hide count
        $("#tab-ongoing").text("Ongoing Submissions");

        $(".tab-ongoing tbody tr:gt(0)").remove();
        $(".tab-ongoing tbody:last-child").append('<tr><td colspan=2>There are no documents for notarization pending right now…</td></tr>');
    }
}