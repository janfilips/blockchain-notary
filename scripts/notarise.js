$(document).ready(function () {
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source like Metamask")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);


    } else {
        window.alert("No web3 detected. This site is a Web3 Dapp - to proceed you will need to get Metamask https://metamask.io/");
    }

});