// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Collection {
    string public name;
    int public cardCount;
    mapping(string => string) public cards;

    constructor(string memory _name, int _cardCount) {
        name = _name;
        cardCount = _cardCount;
    }

    //Add a new card 
    function setCard(string memory cardName, string memory cardURI) public {
        cards[cardName] = cardURI;
    }

    //Get card info from collection
    function getCardInfo(
        string memory cardName
    ) public view returns (string memory) {
        return cards[cardName];
    }
}
