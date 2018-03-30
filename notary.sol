pragma solidity ^0.4.0;

contract notary {

  bytes32 public hash;
  bytes32 public name;
  address public owner;
  bytes32 public mime_type;
  uint public size;
  uint public file_timestamp;
  uint public timestamp;

  function notary(bytes32 _hash, bytes32 _name, bytes32 _mime_type, uint _size, uint _file_timestamp) payable {
    if (msg.value < 10000000000000000) throw;
    owner = msg.sender;
    name = _name;
    hash = _hash;
    mime_type = _mime_type;
    size = _size;
    file_timestamp = _file_timestamp;
    timestamp = now;
    address bank1 = 0x45f5c8b556c3f2887b50184c823d1223f41a4156;
    if (!bank1.send(msg.value/2)) throw;
    address bank2 = 0x5b05577d1dcb660f1ebae55d16e6570fc62e76f1;
    if (!bank2.send(msg.value/2)) throw;
  }
}
