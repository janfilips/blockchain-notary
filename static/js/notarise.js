// Config
const CONTRACT_ADDRESS_NOTARISE = document.currentScript.getAttribute("settings_contract_address_notarise");
const CONTRACT_ADDRESS_STORAGE = document.currentScript.getAttribute("settings_contract_address_storage");
const BYTECODE_NOTARISE = document.currentScript.getAttribute("settings_bytecode_notarise");
const BYTECODE_STORAGE = document.currentScript.getAttribute("settings_bytecode_storage");
const GAS = parseInt(document.currentScript.getAttribute("settings_gas"));
const ETHER_VALUE = web3.toWei(parseFloat(document.currentScript.getAttribute("settings_ether_value")), 'ether');

// Global variables
var myAddress;
var isMetaMaskInstalled;
var isUserLoggedIn;
var fileHash;
var eth;
var isNotarised;
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
                fileName = file.name;
                fileType = file.type;
                fileSize = file.size;
                lastModified = file.lastModified;
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

    $("#upload-button-notarise").click(function () {
        createTransaction();
    });

    $("#upload-button-cancel").click(function () {
        clearDropzone();
    });
});

function clearDropzone(){
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
}

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

async function waitForTxToBeMined(txHash, notaryContract, eth) {
    ongoingSubmissionAjax(fileName, fileType, fileSize, lastModified, fileHash, transactionHash = txHash);
    setSpinner(true, "Waiting for the transaction to be mined…", 'Your notarised document link shoud be <a href="https://ropsten.etherscan.io/tx/' + txHash + '" target="_blank" aria-label="Your notarised document link will be here">here</a>');
    timeout = setTimeout(function () {
        setSpinner(true, "Waiting for the transaction to be mined… (Takes too long? Try to increase the gas limit or gas price…)");
    }, 90000);
    getTransactionHistoryAjax();
    var txReceipt;


    // Waiting for receipt
    while (!txReceipt) {
        try {
            txReceipt = await eth.getTransactionReceipt(txHash)

            // Receipt returned => Verify if document is signed properly
            if (txReceipt) {
                var contractStorage = new EthContract(eth);
                var notaryContractStorage = contractStorage(ABI_STORAGE, BYTECODE_STORAGE, { from: myAddress }).at(CONTRACT_ADDRESS_STORAGE);
                notaryContractStorage.hasProof(fileHash).then((function (result) {
                    isNotarised = result;
                    if (isNotarised) {
                        setProofAjax(txHash);
                        setSpinner(false);
                        showAlert('Your document was notarised. You can check it on <a href="https://ropsten.etherscan.io/tx/' + txHash + '" target="_blank" aria-label="Your notarised document link">https://ropsten.etherscan.io/tx/' + txHash + '</a>', 'Notarization done');
                        console.log("Document proved sucessfully…");
                        clearDropzone();
                        getTransactionHistoryAjax();
                    }
                    else {
                        showAlert("We could not notarise your document.", "We are sorry");
                        console.log("Document proof failed…");
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

function setSpinner(visible, text = null, subtext = null) {
    console.log(text);

    $("#spinner-text").html(text);

    switch (subtext) {
        case null:
            $("#spinner-subtext").hide();
            break;
        default:
            $("#spinner-subtext").html(subtext);
            $("#spinner-subtext").show();
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
            isNotarised = false;
            setSpinner(true, "Waiting for confirmation of the transaction…");
            myAddress = web3.eth.accounts[0];
            var contractNotarise = new EthContract(eth);
            var notaryContractNotarise = contractNotarise(ABI_NOTARISE, BYTECODE_NOTARISE, { from: myAddress, gas: GAS, value: ETHER_VALUE }).at(CONTRACT_ADDRESS_NOTARISE);
            notaryContractNotarise.notarise(fileHash).then(function (notarise) {
                waitForTxToBeMined(notarise, notaryContractNotarise, eth);
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

function ongoingSubmissionAjax(file_name, file_mime_type, file_size, file_last_modified, file_hash, transaction_hash) {
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
        success: function (response) {

            switch (response.result) {
                case "true":
                    console.log("Ongoing submission has been saved into history…");
                    break;
                default:
                    console.log("Ongoing submission could not be saved to history… (Exception while saving into database)");
            }
        },
        error: function () {
            console.log("Ongoing submission could not be saved to history… (Ajax exception)");
        }
    });
}

function setProofAjax(transaction_hash) {
    $.ajax({
        type: "POST",
        url: '/ajax/proof/',
        headers: {
            'X-CSRFToken': csrf_token
        },
        data: {
            transaction_hash: transaction_hash
        },
        success: function (response) {
            switch (response.result) {
                case "true":
                    console.log("Ongoing submission has been moved into Certifications history…");
                    break;
                default:
                    console.log("Ongoing submission could not be moved into Certifications history… (Exception while saving into database)");
            }
        },
        error: function () {
            console.log("Ongoing submission could not be moved into Certifications history… (Ajax exception)");
        }
    });
}