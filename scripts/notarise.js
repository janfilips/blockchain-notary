var provider;

window.addEventListener('load', function () {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {

        // Use the browser's ethereum provider
        provider = web3.currentProvider

    } else {
        console.log('No Etherum accound found. Please log into MetaMask or Mist')
    }

})

$("#upload-button-notarise").click(function () {
    alert(provider);
});