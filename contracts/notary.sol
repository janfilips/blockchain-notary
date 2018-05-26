pragma solidity ^0.4.13;

contract Notary {
    
    address public investor1 = 0x96E0089c04c99E69E4445787bA4CC3cEA6e1B82f;
    address public investor2 = 0xCF4e87991826081d172B61b2e1B2800F18dA8cE7;

    // TODO XXX: replace this with storage, this needs to be accessible from newly deployed contracts
    // right now, when you deploy a new contract, all this information is being lost as it is stored in an in-memory per-contract base.
    mapping (string => bool) private proofs;

    event LogBalance(address, uint);
    
    function Notary() payable {
    }
    
    function notarise(string proof) public payable returns (bool success) {
        proofs[proof] = true;
        _payRoyalty();
        return true;
    }

    function _payRoyalty() public payable {
        uint amount = msg.value;
        investor1.transfer(amount/10*9);
        investor2.transfer(amount/10);
    }
    
    // fallback function
    function () payable {
    }
    
}
