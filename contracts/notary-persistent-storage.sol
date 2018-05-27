pragma solidity ^0.4.13;

contract NotaryPersistentStorage {

    mapping (bytes32 => bool) private proofs;

    function NotaryStorage() {
    }

    function storeProof(bytes32 _proof) public returns (bool) {
        proofs[_proof] = true;
        return true;
    }

    function hasProof(bytes32 _proof) public constant returns (bool) {
        return proofs[_proof];
    }

}
