const contractAddress = '0xb9e60e66223614dee25a540d554e3d64e73fbc4b';
const byteCode = "608060405234801561001057600080fd5b5061015e806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e3d1e6d614610051578063e7e9f3851461009a575b600080fd5b34801561005d57600080fd5b5061008060048036038101908080356000191690602001909291905050506100cb565b604051808215151515815260200191505060405180910390f35b3480156100a657600080fd5b506100c960048036038101908080356000191690602001909291905050506100fc565b005b6000806000836000191660001916815260200190815260200160002060009054906101000a900460ff169050919050565b6001600080836000191660001916815260200190815260200160002060006101000a81548160ff021916908315150217905550505600a165627a7a723058202f28747a8e344601a677093c4b07a6e1fb3a6a91c059626efa959f5113c766560029";
const gas = "100000";
const etherValue = web3.toWei(1, 'ether');

var myAddress;
var isMetaMaskInstalled;
var isLoggedIn;
var hash;
var eth;
var isNotarised;

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
    reader.addEventListener("loadend", function (event) { hash = "0x" + sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(event.target.result)); $("#hash-result").html(hash); getHashOnDone(); });
    reader.readAsBinaryString(file);
}

function getHashOnDone() {
    $("#upload-button-notarize").prop("disabled", false);
    $("#upload-button-cancel").prop("disabled", false);
}

async function waitForTxToBeMined (txHash, notaryContract) {
    let txReceipt
    while (!txReceipt) {
      try {
        txReceipt = await eth.getTransactionReceipt(txHash)
            if(txReceipt){
                notaryContract.hasProof(hash).then((function(result){
                    isNotarised=result;
                    if(isNotarised)
                    {
                    window.location.href="https://ropsten.etherscan.io/tx/"+txHash;
                    }
                    else{
                        showAlert("Your document has not been notarized. Low gas?", "We are sorry...");
                    }
                }));
            }
            else{
                console.log("Waiting...");
            }
      } catch (err) {
        alert(err);
      }
    }
  }

function sendTransaction() {
    if (isMetaMaskInstalled) {
        eth = new Eth(web3.currentProvider);
        if (isLoggedIn) {
            isNotarised=false;
            myAddress = web3.eth.accounts[0];
            var contract = new EthContract(eth);
            var notaryContract = contract(abi, byteCode, { from: myAddress, gas: gas }).at(contractAddress);
            notaryContract.notarise(hash).then(function (notarise) {
               waitForTxToBeMined(notarise, notaryContract);
            });
        }
        else {
            showAlert("You are not logged into your MetaMask account. You need to log in before notary your file and refresh page.", "Not Logged In");
        }
    }
    else {
        showAlert("This is a blockchain application, you need to install Metamask from <a href='https://metamask.io/' target='_blank'>MetaMask.io</a> if you want to play around with blockchains.", "MetaMask not detected");
    }
}
