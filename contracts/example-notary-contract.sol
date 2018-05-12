pragma solidity ^0.4.4;

contract ProofOfExistence {
  // state
  mapping (bytes32 => bool) private proofs;

  // store a proof of existence in the contract state
  // *transactional function*
  function storeProof(bytes32 proof) {
    proofs[proof] = true;
  }

  // calculate and store the proof for a document
  // *transactional function*
  function notarize(string document) {
    var proof = calculateProof(document);
    storeProof(proof);
  }

  // helper function to get a document’s SHA256 hash
  // *read-only function
  function calculateProof(string document) constant returns (bytes32) {
    return sha256(document);
  }

  // check if a document has been notarised
  // *read-only function*
  function checkDocument(string document) constant returns (bool) {
    var proof = calculateProof(document);
    return hasProof(proof);
  }

  // returns true if proof is stored
  // *read-only function*
  function hasProof(bytes32 proof) constant returns (bool) {
    return proofs[proof];
  }
}
