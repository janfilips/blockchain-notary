const contract_address = '0xf035755df96ad968a7ad52c968dbe86d52927f5b';

var isMetaMaskInstalled;
var isLoggedIn;
var eth;
const etherValue=web3.toWei(10, 'ether');
var address = '0x91612055A68aD74A6e756615941Ac59e9220A940';
var token;

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
        initContract();
        sendContract();
    });
});

function initContract(){
    if (isMetaMaskInstalled) {
        var eth = new Eth(web3.currentProvider);
        var contract=new EthContract(eth);
        token = contract(abi).at(contract_address);
    }
}

async function waitForTxToBeMined(txHash) {
    let txReceipt
    while (!txReceipt) {
        try {
            txReceipt = await eth.getTransactionReceipt(txHash)
        } catch (err) {
            return indicateFailure(err)
        }
    }
    indicateSuccess()
}

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

$("#upload-button-cancel").click(function () {
    $("#upload-button-notarize").prop("disabled", true);
    $("#upload-button-cancel").prop("disabled", true);
    $("#upload-buttons").hide();
    $("[data-file-name]").html("Unknown");
    $("[data-file-type]").html("Unknown");
    $("[data-file-size]").html("Unknown");
    $("[data-file-last-modified]").html("Unknown");
    $(".spinner").show();
    $("#hash-result").html("");
    $("#dropzone-results").hide();
    Dropzone.forElement("#dropzoneform").removeAllFiles(true);
    $("#dropzone").show();
});

function sendContract() {
    if (isMetaMaskInstalled) {
        if (isLoggedIn) {
            token.transfer(contract_address, '88888888888888888888', { from: address })
                .then(function (txHash) {
                    console.log('Transaction sent')
                    console.dir(txHash)
                    waitForTxToBeMined(txHash)
                })
                .catch(console.error)
        }
        else {
            showAlert("You are not logged into your MetaMask account. You need to log in before notary your file and refresh page.", "Not Logged In");
        }
    }
    else {
        showAlert("This is a blockchain application, you need to install Metamask from <a href='https://metamask.io/' target='_blank'>MetaMask.io</a> if you want to play around with blockchains.", "MetaMask not detected");
    }
}
