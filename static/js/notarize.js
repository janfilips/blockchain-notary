const contractAddress = '0x007f60e293650dc510d20d4ffb4c97c94d51ffd4';
const byteCode = "608060405234801561001057600080fd5b5060405160208061029c83398101806040528101908080519060200190929190505050806000806101000a81548160ff021916908360ff1602179055505061023f8061005d6000396000f300608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630c55699c146100675780635d324c1314610098578063661d8829146100c9578063f6af0d98146100fa575b600080fd5b34801561007357600080fd5b5061007c61012b565b604051808260ff1660ff16815260200191505060405180910390f35b3480156100a457600080fd5b506100ad61013d565b604051808260ff1660ff16815260200191505060405180910390f35b3480156100d557600080fd5b506100de61018d565b604051808260ff1660ff16815260200191505060405180910390f35b34801561010657600080fd5b5061010f6101d0565b604051808260ff1660ff16815260200191505060405180910390f35b6000809054906101000a900460ff1681565b600080600090505b60648160ff16101561017857806000806101000a81548160ff021916908360ff1602179055508080600101915050610145565b6000809054906101000a900460ff1691505090565b600060056000808282829054906101000a900460ff160192506101000a81548160ff021916908360ff1602179055506000809054906101000a900460ff16905090565b600060056000808282829054906101000a900460ff160392506101000a81548160ff021916908360ff1602179055506000809054906101000a900460ff169050905600a165627a7a7230582073cc5acaef4d01de666a05a0a5cd52ad4c9dbe10c521c8d31254c2943fe0f12c0029";
const gas = "30000";
const etherValue = web3.toWei(1, 'ether');

var myAddress;
var isMetaMaskInstalled;
var isLoggedIn;

Dropzone.autoDiscover = false;

$(document).ready(function () {
    if (typeof web3 !== 'undefined') {

        isMetaMaskInstalled = true;

        if (web3.eth.accounts.length !== 0) {
            isLoggedIn = true;
        }
    }

    $('#dropzoneform').dropzone({
        maxFiles: 1,
        uploadMultiple: false,
        init: function () {
            this.on("addedfile", function (file) {
                $("#dropzoneform").hide().next().hide();
                $("#upload-buttons").show();
                $("#dropzone-results").show();
                $("[data-file-name]").html(file.name);
                if (file.type) {
                    $("[data-file-type]").html(file.type);
                }
                else {
                    $("[data-file-type]").html("Unknown");
                }
                $("[data-file-size]").html(file.size);
                $("[data-file-last-modified]").html(file.lastModifiedDate);
                getHash(file);

                // Format file size
                formatFileSize();
            });
        }
    });

    $("#upload-button-notarize").click(function () {
        sendTransaction();
    });

    $("#upload-button-cancel").click(function () {
        $("#upload-button-notarize").prop("disabled", true);
        $("#upload-button-cancel").prop("disabled", true);
        $("#upload-buttons").hide();
        $("[data-file-name]").html("Unknown");
        $("[data-file-type]").html("Unknown");
        $("[data-file-size]").html("Unknown");
        $("[data-file-last-modified]").html("Unknown");
        $("#hash-result").text("");
        $("#dropzoneform").show();
        Dropzone.forElement("#dropzoneform").removeAllFiles(true);
        $("#dropzone-results").hide();
        $(".additional-info").show();
    });
});

function formatFileSize() {
    $("[data-file-size]").formatNumber();
    $("[data-file-size]").html($("[data-file-size]").html() + " bytes");
}

function getHash(file) {
    var reader = new FileReader();
    reader.addEventListener("loadend", function (event) { $("#hash-result").html("0x" + sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(event.target.result))); getHashOnDone(); });
    reader.readAsBinaryString(file);
}

function getHashOnDone() {
    $("#upload-button-notarize").prop("disabled", false);
    $("#upload-button-cancel").prop("disabled", false);
    $(".spinner").hide();
}

function sendTransaction() {
    if (isMetaMaskInstalled) {
        var eth = new Eth(web3.currentProvider);
        if (isLoggedIn) {
            myAddress=web3.eth.accounts[0];
            // var notaryContract = contract(abi, byteCode, { from: myAddress, gas: gas }).at(contractAddress);
            // notaryContract.addFive().then(function (addFive) {
            //     alert();
            // });
        }
        else {
            showAlert("You are not logged into your MetaMask account. You need to log in before notary your file and refresh page.", "Not Logged In");
        }
    }
    else {
        showAlert("This is a blockchain application, you need to install Metamask from <a href='https://metamask.io/' target='_blank'>MetaMask.io</a> if you want to play around with blockchains.", "MetaMask not detected");
    }
}
