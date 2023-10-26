// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Collection.sol";
import "./Card.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
    int private count;
    mapping(string => Collection) private collections;
    Card private cardFactory;

    constructor() {
        count = 0;
        cardFactory = new Card();
    }

    function createCollection(
        string calldata name,
        int cardCount
    ) external onlyOwner {
        collections[name] = new Collection(name, cardCount);
    }

    function createCard(
        string calldata collectionName,
        string calldata cardName,
        string calldata cardURI
    ) external onlyOwner {
        collections[collectionName].setCard(cardName, cardURI);
    }

    function assign(
        string calldata collectionName,
        string calldata cardName,
        address user
    ) external onlyOwner {
        string memory cardMetadata = collections[collectionName].getCardInfo(
            cardName
        );
        cardFactory.assignCard(user, cardMetadata);
    }
}
