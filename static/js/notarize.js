// Config
const contractAddress = '0xb9e60e66223614dee25a540d554e3d64e73fbc4b';
const byteCode = "608060405234801561001057600080fd5b5061015e806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e3d1e6d614610051578063e7e9f3851461009a575b600080fd5b34801561005d57600080fd5b5061008060048036038101908080356000191690602001909291905050506100cb565b604051808215151515815260200191505060405180910390f35b3480156100a657600080fd5b506100c960048036038101908080356000191690602001909291905050506100fc565b005b6000806000836000191660001916815260200190815260200160002060009054906101000a900460ff169050919050565b6001600080836000191660001916815260200190815260200160002060006101000a81548160ff021916908315150217905550505600a165627a7a723058202f28747a8e344601a677093c4b07a6e1fb3a6a91c059626efa959f5113c766560029";
const gas = "50000";
const etherValue = web3.toWei(1, 'ether');

// Global variables
var myAddress;
var isMetaMaskInstalled;
var isUserLoggedIn;
var fileHash;
var eth;
var isNotarized;

Dropzone.autoDiscover = false;

$(document).ready(function () {
    if (typeof web3 !== 'undefined') {

        isMetaMaskInstalled = true;

        if (web3.eth.accounts.length !== 0) {
            isUserLoggedIn = true;
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
                $(".spinner-hashing").show();
                $("#spinner-text").show();
                $("#spinner-text").text("Hashing file…");
                getHash(file);

                // Format file size
                formatFileSize();
            });
        }
    });

    $("#upload-button-notarize").click(function () {
        createTransaction();
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
        $(".spinner-mining").hide();
    });
});

function formatFileSize() {
    $("[data-file-size]").formatNumber();
    $("[data-file-size]").html($("[data-file-size]").html() + " bytes");
}

function getHash(file) {
    var reader = new FileReader();
    reader.addEventListener("loadend", function (event) { fileHash = "0x" + sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(event.target.result)); $("#hash-result").html(fileHash); getHashOnDone(); });
    reader.readAsBinaryString(file);
}

function getHashOnDone() {
    $("#upload-button-notarize").prop("disabled", false);
    $("#upload-button-cancel").prop("disabled", false);
    $("#spinner-text-hashing").hide();
    $(".spinner-hashing").hide();
}

async function waitForTxToBeMined (txHash, notaryContract) {
    $("#spinner-text-mining").text("Waiting for the transaction to be mined…");
    $("#upload-button-cancel").prop("disabled", true);
    var txReceipt;

    // Waiting for receipt
    while (!txReceipt) {
      try {
        txReceipt = await eth.getTransactionReceipt(txHash)

            // Receipt returned => Verify if document is signed properly
            if(txReceipt){
                notaryContract.hasProof(fileHash).then((function(result){
                    isNotarized=result;
                    if(isNotarized)
                    {
                    $(".spinner-hashing").hide();
                    $("#spinner-text-hashing").hide();
                    window.location.href="https://ropsten.etherscan.io/tx/"+txHash;
                    }
                    else{
                        showAlert("We could not notarise your document.", "We are sorry.");
                    }
                }));
            }
            else{
                    console.log("Waiting for the blockchain transaction to be mined…");
            }
      } catch (err) {
          showAlert("An error occured. See the console for further info...", "An error occured.");
        console.log(err);
      }
    }
  }

function errorHandler(_error){

    var error=_error.toString();

    // User rejected transaction
    if(error.indexOf("User denied transaction signature")>=0){
        $(".spinner-mining").hide();
    }
}

function createTransaction() {
    if (isMetaMaskInstalled) {
        eth = new Eth(web3.currentProvider);
        if (isUserLoggedIn) {
            isNotarized=false;
            $(".spinner-mining").show();
            setTimeout(function(){
                $("#spinner-text-mining").text($("#spinner-text-mining").text()+" (Takes too long? Try to increase the gas limit or gas price..)");
            }, 50000);
            myAddress = web3.eth.accounts[0];
            var contract = new EthContract(eth);
            var notaryContract = contract(abi, byteCode, { from: myAddress, gas: gas }).at(contractAddress);
            notaryContract.notarise(fileHash).then(function (notarise) {
               waitForTxToBeMined(notarise, notaryContract);
            }).catch(function(error){errorHandler(error)});
        }
        else {
            showAlert("You are not logged to your MetaMask account. You need to log in to MetaMask and refresh this page.", "Not Logged In");
        }
    }
    else {
        showAlert("This is a blockchain application, you need to install Metamask from <a href='https://metamask.io/' target='_blank'>MetaMask.io</a> if you want to play around with blockchains.", "MetaMask not detected");
    }
}
