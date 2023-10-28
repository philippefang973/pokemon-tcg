// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Collection.sol";
import "./Card.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract Main is Ownable {
    mapping(string => Collection) private collections;
    Card private cardFactory;
    mapping(address => uint256[]) private ownedNFTs;

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
        uint256 newMint = cardFactory.assignCard(user, cardMetadata);
        ownedNFTs[user].push(newMint);
        /* for (uint8 i = 0; i < ownedNFTs[user].length; i++) {
            console.log(ownedNFTs[user][i]);
        } */
    }

    function ownedBy(
        address user
    ) public view onlyOwner returns (uint256[] memory) {
        return ownedNFTs[user];
    }

    function ownedCount(address user) public view onlyOwner returns (uint) {
        return ownedNFTs[user].length;
    }

    function readCard(uint256 cardId) public view returns (string memory) {
        return cardFactory.metadata(cardId);
    }
}
