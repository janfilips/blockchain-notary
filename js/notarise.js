var isMetaMaskInstalled;

$(document).ready(function () {

    // MetaMask injected
    if (typeof web3 !== 'undefined') {
        eth = new Eth(web3.currentProvider);
        isMetaMaskInstalled = true;

        // MetaMask not injected
    } else {
        showAlert("This is a blockchain application, you need to install Metamask from <a href='https://metamask.io/' target='_blank'>MetaMask.io</a> if you want to play around with blockchains.", "MetaMask not detected");
    }

});

Dropzone.options.dropzoneform = {
    maxFiles: 1,
    uploadMultiple: false,
    init: function () {
        this.on("addedfile", function (file) {
            $("#dropzone").hide();
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
};

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
    $("#upload-button-notarise").prop("disabled", false);
    $("#upload-button-cancel").prop("disabled", false);
    $(".spinner").hide();
}

$("#upload-button-cancel").click(function () {
    $("#upload-button-notarise").prop("disabled", true);
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

$("#upload-button-notarise").click(function () {
    sendContract();
});

function isLoggedIn(showAlert) {
    if (web3.eth.accounts.length !== 0) {
        return true;
    }
    else {
        return false;
        if (showAlert) { 
            showAlert("You are not logged into your MetaMask account. You need to log in before notary your file.", "Not Logged In");
        }
    }
}

function initContract(contract) {
    const MiniToken = contract(abi);
    const miniToken = MiniToken.at(address);
    listenForClicks(miniToken);
}

function sendContract() {
    if (isLoggedIn(true)) { 
        var ethContract = new EthContract(eth);
        var contract = ethContract(abi);
        var request = contract.at(address);
    }
}
