// Config
const CONTRACT_ADDRESS_NOTARISE = "0xfbf73345a36badc85607397ddc3221010dd3e262";
const CONTRACT_ADDRESS_STORAGE = "0xb7deffae2662d7743cbe3f5c6e5904814cf2aa13";
const BYTECODE_NOTARISE = "60806040527396e0089c04c99e69e4445787ba4cc3cea6e1b82f6000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073cf4e87991826081d172b61b2e1b2800f18da8ce7600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073b7deffae2662d7743cbe3f5c6e5904814cf2aa13600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061053b806101116000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631afa8e3b1461006f5780638e0b10f7146100c6578063bcbc15851461011d578063e3d1e6d614610127578063e7e9f38514610170575b005b34801561007b57600080fd5b506100846101ac565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100d257600080fd5b506100db6101d2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101256101f7565b005b34801561013357600080fd5b5061015660048036038101908080356000191690602001909291905050506102eb565b604051808215151515815260200191505060405180910390f35b610192600480360381019080803560001916906020019092919050505061041e565b604051808215151515815260200191505060405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60003490506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc606360648481151561024557fe5b04029081150290604051600060405180830381858888f19350505050158015610272573d6000803e3d6000fd5b50600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6064838115156102bb57fe5b049081150290604051600060405180830381858888f193505050501580156102e7573d6000803e3d6000fd5b5050565b6000806000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1691508173ffffffffffffffffffffffffffffffffffffffff1663e3d1e6d6856040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808260001916600019168152602001915050602060405180830381600087803b15801561038c57600080fd5b505af11580156103a0573d6000803e3d6000fd5b505050506040513d60208110156103b657600080fd5b810190808051906020019092919050505090507f99dcbed383f977207af954640cdd07880787f30fbf3fc94ecdb326204116d0458482604051808360001916600019168152602001821515151581526020019250505060405180910390a18092505050919050565b6000806000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1691508173ffffffffffffffffffffffffffffffffffffffff16638952877b856040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808260001916600019168152602001915050602060405180830381600087803b1580156104bf57600080fd5b505af11580156104d3573d6000803e3d6000fd5b505050506040513d60208110156104e957600080fd5b810190808051906020019092919050505090506105046101f7565b6001925050509190505600a165627a7a72305820aed79a41ea390f6d17d6958478bfcbd835ff2dcea1b9afd6cd6cf83106c42be10029";
const BYTECODE_STORAGE = "608060405234801561001057600080fd5b506101a2806100206000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806310f7982a1461005c5780638952877b14610073578063e3d1e6d6146100bc575b600080fd5b34801561006857600080fd5b50610071610105565b005b34801561007f57600080fd5b506100a26004803603810190808035600019169060200190929190505050610107565b604051808215151515815260200191505060405180910390f35b3480156100c857600080fd5b506100eb6004803603810190808035600019169060200190929190505050610145565b604051808215151515815260200191505060405180910390f35b565b60006001600080846000191660001916815260200190815260200160002060006101000a81548160ff02191690831515021790555060019050919050565b6000806000836000191660001916815260200190815260200160002060009054906101000a900460ff1690509190505600a165627a7a72305820292cb37e57b4cca4199906874c117aa62be8754268b9f9db65e563f97b5a25740029";
const GAS = "99000";
const ETHER_VALUE = web3.toWei(1, 'ether');

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
    setSpinner(true, "Waiting for the transaction to be mined…", 'Your notarised document can be tracked <a href="https://ropsten.etherscan.io/tx/' + txHash + '" target="_blank" aria-label="">'+ txHash + '</a>');
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
            var notaryContractNotarise = contractNotarise(ABI_NOTARISE, BYTECODE_NOTARISE, { from: myAddress, gas: GAS, value: web3.toWei(1, 'ether') }).at(CONTRACT_ADDRESS_NOTARISE);
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