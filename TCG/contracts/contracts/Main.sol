// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Collection.sol";
import "./Card.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Main is Ownable {
    mapping(string => Collection) private collections;
    Card private cardFactory;

    constructor() {
        cardFactory = new Card();
    }

    function createCollection(
        string memory name,
        int cardCount
    ) public returns (string memory) {
        collections[name] = new Collection(name, cardCount);
        emit collectionCreated(collections[name]);
        console.log(name);
        return name;
    }

    event collectionCreated(Collection c);

    function createCard(
        string memory collectionName,
        string memory cardName,
        string memory cardURI
    ) external onlyOwner {
        collections[collectionName].setCard(cardName, cardURI);
        console.log(collections[collectionName].getCardInfo(cardName));
    }

    function assign(
        string memory collectionName,
        string memory cardName,
        address user
    ) public onlyOwner {
        string memory cardMetadata = collections[collectionName].getCardInfo(
            cardName
        );
        cardFactory.assignCard(user, cardMetadata);
    }
}
