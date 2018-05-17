pragma solidity ^0.4.13;


contract Notarise {

  mapping (bytes32 => bytes32) private proofs;

  // store a proof of existence in the contract state
  // *transactional function*
  function notariseWithTitle(bytes32 proof, bytes32 document_title) public {
    proofs[proof] = document_title;
  }
  function notarise(bytes32 proof) public {
    proofs[proof] = "notarised";
  }

  // returns true if proof is stored
  // *read-only function*
  function hasProof(bytes32 proof) public constant returns (bytes32) {
    return proofs[proof];
  }

}
