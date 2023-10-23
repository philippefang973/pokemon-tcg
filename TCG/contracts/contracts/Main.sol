// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Collection.sol";
import "./Card.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
    int private count;
    mapping(int => Collection) private collections;
    Card private cardFactory;

    constructor() {
        count = 0;
        cardFactory = new Card();
    }

    function createCollection(
        string calldata name,
        int cardCount
    ) external onlyOwner {
        collections[count++] = new Collection(name, cardCount);
    }

    function assign(
        int collectionId,
        string memory cardName,
        address user
    ) external onlyOwner {
        string memory cardMetadata = collections[collectionId].getCardInfo(
            cardName
        );
        cardFactory.assignCard(user, cardMetadata);
    }
}
