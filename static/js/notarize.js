// Config
const contractAddress = "0x5aedca0f74d7cc0696f5e316fc0241a4bfa850df";
const byteCode = "60806040527396e0089c04c99e69e4445787ba4cc3cea6e1b82f6000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073cf4e87991826081d172b61b2e1b2800f18da8ce7600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610390806100bc6000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631afa8e3b1461006f5780638e0b10f7146100c6578063bcbc15851461011d578063e3d1e6d614610127578063e7e9f38514610170575b005b34801561007b57600080fd5b506100846101ac565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100d257600080fd5b506100db6101d2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101256101f7565b005b34801561013357600080fd5b5061015660048036038101908080356000191690602001909291905050506102eb565b604051808215151515815260200191505060405180910390f35b610192600480360381019080803560001916906020019092919050505061031d565b604051808215151515815260200191505060405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60003490506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6009600a8481151561024557fe5b04029081150290604051600060405180830381858888f19350505050158015610272573d6000803e3d6000fd5b50600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600a838115156102bb57fe5b049081150290604051600060405180830381858888f193505050501580156102e7573d6000803e3d6000fd5b5050565b600060026000836000191660001916815260200190815260200160002060009054906101000a900460ff169050919050565b6000600160026000846000191660001916815260200190815260200160002060006101000a81548160ff02191690831515021790555061035b6101f7565b600190509190505600a165627a7a72305820e648156388111974a17d1f69115cc206f1bd4bc0c495ba5ec92ffb4a7c1a44e80029";
const gas = "99000";
const etherValue = web3.toWei(1, 'ether');

// Global variables
var myAddress;
var isMetaMaskInstalled;
var isUserLoggedIn;
var fileHash;
var eth;
var isNotarized;
var timeout;
var fileName;
var fileType;
var fileSize;
var lastModified;
var csrf_token;


Dropzone.autoDiscover = false;

$(document).ready(function () {
    csrf_token = $("[name=csrfmiddlewaretoken]").val();
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
                fileName=file.name;
                fileType=file.type;
                fileSize=file.size;
                lastModified=file.lastModified;
                $("#dropzoneform").hide().next().hide();
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
                setSpinner(true, "Hashing file…");
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
        setSpinner(false);
        clearTimeout(timeout);
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
    setSpinner(false);
    $("#upload-buttons").show();
}

async function waitForTxToBeMined(txHash, notaryContract) {
    ongoingSubmissionAjax(fileName, fileType, fileSize, lastModified, fileHash, transactionHash=txHash);
    setSpinner(true, "Waiting for the transaction to be mined…");
    getTransactionHistoryAjax();
    var txReceipt;

    // Waiting for receipt
    while (!txReceipt) {
        try {
            txReceipt = await eth.getTransactionReceipt(txHash)

            // Receipt returned => Verify if document is signed properly
            if (txReceipt) {
                notaryContract.hasProof(fileHash).then((function (result) {
                    isNotarized = result;
                    if (isNotarized) {
                        setProofAjax(txHash);
                        setSpinner(false);
                        showAlert('Your document was notarized. You can check it on <a href="https://ropsten.etherscan.io/tx/"'+txHash+' target="_blank" aria-label="Your notarized document link">https://ropsten.etherscan.io/tx/'+txHash+'</a>', 'Notarization done');
                        getTransactionHistoryAjax();
                    }
                    else {
                        showAlert("We could not notarise your document.", "We are sorry");
                    }
                }));
            }
            else {
                console.log("Waiting for the blockchain transaction to be mined…");
            }
        } catch (err) {
            showAlert("An error occured. See the console for further info…", "An error occured");
            console.log(err);
        }
    }
}

function errorHandler(_error) {

    var error = _error.toString();

    // User rejected transaction
    if (error.indexOf("User denied transaction signature") >= 0) {
        setSpinner(false);
    }
}

function setSpinner(visible, text = null, add=false) {
    switch(add){
        case true:
            $("#spinner-text").text($("#spinner-text").text()+text);
            break;
        default:
            $("#spinner-text").text(text);
            break;
    }

    switch (visible) {
        case false:
            $(".spinner").hide();
            break;
        default:
            $(".spinner").show();
            break;
    }
}

function createTransaction() {
    if (isMetaMaskInstalled) {
        eth = new Eth(web3.currentProvider);
        if (isUserLoggedIn) {
            isNotarized = false;
            setSpinner(true, "Waiting for confirmation of the transaction…");
            timeout=setTimeout(function () {
                setSpinner(true, " (Takes too long? Try to increase the gas limit or gas price…)", true);
            }, 90000);
            myAddress = web3.eth.accounts[0];
            var contract = new EthContract(eth);
            var notaryContract = contract(abi, byteCode, { from: myAddress, gas: gas, value: web3.toWei(1,'ether') }).at(contractAddress);
            notaryContract.notarise(fileHash).then(function (notarise) {
                waitForTxToBeMined(notarise, notaryContract);
            }).catch(function (error) { errorHandler(error) });

        }
        else {
            showAlert("You are not logged to your MetaMask account.<br/><br/>You need to log in to MetaMask and refresh this page.", "Not Logged In");
        }
    }
    else {
        showAlert("This is a blockchain application, you need to install Metamask from <a href='https://metamask.io/' target='_blank'>MetaMask.io</a> if you want to play around with blockchains.", "MetaMask not detected");
    }
}

function ongoingSubmissionAjax(file_name, file_mime_type, file_size, file_last_modified, file_hash, transaction_hash){
    $.ajax({
        type: "POST",
        url: '/ajax/ongoing_submissions/',
        dataType: "json",
        headers: {
            'X-CSRFToken': csrf_token
        },
        cache: false,
        data: {
            file_name: file_name,
            file_mime_type: file_mime_type,
            file_size: file_size,
            file_last_modified: file_last_modified,
            file_hash,
            has_proof: "False",
            transaction_hash: transaction_hash
        },
        success: function(response){

            switch(response.result){
                case "true":
                    console.log("Ongoing submission has been saved into history…");
                    break;
                default:
                    console.log("Ongoing submission could not be saved to history… (Exception while saving into database)");
            }
        },
        error: function(){
            console.log("Ongoing submission could not be saved to history… (Ajax exception)");
        }
    });
}

function setProofAjax(transaction_hash){
    $.ajax({
        type: "POST",
        url: '/ajax/proof/',
        headers: {
            'X-CSRFToken': csrf_token
        },
        data: {
            transaction_hash: transaction_hash
        },
        success: function(response){
            switch(response.result){
                case "true":
                    console.log("Ongoing submission has been moved into Certifications history…");
                    break;
                default:
                    console.log("Ongoing submission could not be moved into Certifications history… (Exception while saving into database)");
            }
        },
        error: function(){
            console.log("Ongoing submission could not be moved into Certifications history… (Ajax exception)");
        }
    });
}