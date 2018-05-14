pragma solidity ^0.4.13;

contract SimpleTest {
uint8 public x;

function SimpleTest(uint8 _x) public {
x = _x;
}

function addFive() public returns (uint8) {
x += 5;
return x;
}
function substractFive() public returns (uint8) {
x -= 5;
return x;
}
}