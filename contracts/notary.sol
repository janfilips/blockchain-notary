pragma solidity ^0.4.13;


contract Notary {
    
    address public investor1 = 0x96E0089c04c99E69E4445787bA4CC3cEA6e1B82f;
    address public investor2 = 0xCF4e87991826081d172B61b2e1B2800F18dA8cE7;

    address NotaryPersistentStorage = 0x452298c6651b73886e5305f66c717a68cc7047c9;

    event LogResponse(bytes32, bool);

    function Notary() payable {
    }
    
    function notarise(bytes32 _proof) public payable returns (bool success) {
        
        bool response = NotaryPersistentStorage.call(bytes4(sha3("storeProof(bytes32)")),_proof);
        if(response==false) {
            throw;
        }
        
        _payRoyalty();
        
        return true;
    }
    
    function _payRoyalty() public payable {
        uint amount = msg.value;
        investor1.transfer(amount/100*99);
        investor2.transfer(amount/100);
    }
    
    // fallback function
    function () payable {
    }
    
}
