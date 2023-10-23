// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
    int private count;
    mapping(int => Collection) private collections;

    constructor() {
        count = 0;
    }

    function createCollection(
        string calldata name,
        int cardCount
    ) external onlyOwner {
        collections[count++] = new Collection(name, cardCount);
    }
}
