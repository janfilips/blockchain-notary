pragma solidity ^0.4.13;


contract Notary {
    
    address public investor1 = 0x96E0089c04c99E69E4445787bA4CC3cEA6e1B82f;
    address public investor2 = 0xCF4e87991826081d172B61b2e1B2800F18dA8cE7;

    address NotaryPersistentStorageAddress = 0x0aa21f34cd627b56b9ff4326043fc6ae6394c5d7;

    event LogResponse(bytes32, bool);

    function Notary() payable {
    }

    function notarise(bytes32 _proof) public payable returns (bool success) {
        
        NotaryPersistentStorage notary = NotaryPersistentStorage(NotaryPersistentStorageAddress);
        bool result = notary.storeProof(_proof);

        _payRoyalty();
        
        return true;
    }

    function hasProof(bytes32 _proof) public returns (bool) {
        NotaryPersistentStorage notary = NotaryPersistentStorage(NotaryPersistentStorageAddress);
        bool result = notary.hasProof(_proof);
        LogResponse(_proof,result);
        return result;
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


contract NotaryPersistentStorage {
    function storeProof(bytes32 _proof) public returns (bool);
    function hasProof(bytes32 _proof) public constant returns (bool);
}
