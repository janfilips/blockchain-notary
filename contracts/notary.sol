pragma solidity ^0.4.13;


contract Royalty {

    uint public percentage_owned_to_investor1;
    uint public percentage_owned_to_investor2;

    event LogPaymentReceived(address sender, uint amount);
    event LogPaid(address recipient, uint amount);

    function pay(address address1, address address2) public payable returns(bool) {

        percentage_owned_to_investor1 += msg.value / 2;
        emit LogPaid(address1, msg.value/2);

        percentage_owned_to_investor2 += msg.value / 2;
        emit LogPaid(address2, msg.value/2);
    
        return true;
    }

}

contract NotariseWithPayment {

    address public investor1;
    address public investor2;

    // TODO: replace this with storage, this needs to be accessible from newly deployed contracts
    // right now, when you deploy a new contract, all this information is being lost as it is stored in an in-memory per-contract base.
    mapping (bytes32 => bool) private proofs;

    Royalty investors_royalty;

    function NotariseWithPayment(address addressA, address addressB) public {
        investor1 = addressA;
        investor2 = addressB;
    }

    function notarise(bytes32 proof) public {
        proofs[proof] = true;
        investors_royalty.pay(investor1, investor2);
    }
 
}


contract Notarise {

    // This is an old testing notarise contract. It has security and other problems.
    // * do not use *

    mapping (bytes32 => bool) private proofs;

    function notarise(bytes32 proof) public {
        proofs[proof] = true;
    }

    function hasProof(bytes32 proof) public constant returns (bool) {
        return proofs[proof];
    }
    
}
