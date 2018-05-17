pragma solidity ^0.4.13;

contract Notarise {

 mapping (bytes32 => bool) private proofs;

 // store a proof of existence in the contract state
 // *transactional function*
 function notarise(bytes32 proof) public {
   proofs[proof] = true;
 }
 
 // returns true if proof is stored
 // *read-only function*
 function hasProof(bytes32 proof) public constant returns (bool) {
   return proofs[proof];
 }

}