// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Collection {
    string public name;
    int public cardCount;
    mapping(int => string) public cards;

    constructor(string memory _name, int _cardCount) {
        name = _name;
        cardCount = _cardCount;
    }

    function setCard(int spot, string memory cardURI) public {
        cards[spot] = cardURI;
    }
}
