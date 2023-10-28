// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Collection.sol";
import "./Card.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract Main is Ownable {
    mapping(string => Collection) private collections;
    mapping(address => uint256[]) private tokenIds;
    Card private cardFactory;

    event getCardContractAddress(address res);

    constructor() {
        cardFactory = new Card();
        console.log(address(cardFactory));
        emit getCardContractAddress(address(cardFactory));
    }

    function createCollection(
        string memory name,
        int cardCount
    ) public returns (string memory) {
        collections[name] = new Collection(name, cardCount);
        console.log(name);
        return name;
    }

    function createCard(
        string memory collectionName,
        string memory cardName,
        string memory cardURI
    ) public onlyOwner {
        collections[collectionName].setCard(cardName, cardURI);
        console.log(collections[collectionName].getCardInfo(cardName));
    }

    function createMultipleCards(
        string memory collectionName,
        string[] memory cardNames,
        string[] memory cardURIs
    )  public onlyOwner {
        for (uint i = 0; i < cardNames.length; i++) {
            collections[collectionName].setCard(cardNames[i],cardURIs[i]);
        }
    }

    function assign(
        string memory collectionName,
        string memory cardName,
        address user
    ) public onlyOwner {
        string memory cardMetadata = collections[collectionName].getCardInfo(cardName);
        uint256 newCardId = cardFactory.assignCard(user, cardMetadata);
        tokenIds[user].push(newCardId);
    }

    function assignMultiple(
        string memory collectionName,
        string[] memory cardNames,
        address user
    ) public onlyOwner {
        for (uint i = 0; i < cardNames.length; i++) {
            string memory cardMetadata = collections[collectionName].getCardInfo(cardNames[i]);
            uint256 newCardId = cardFactory.assignCard(user, cardMetadata);
            tokenIds[user].push(newCardId);
        }
        console.log(cardFactory.balanceOf(owner()));
    }


    function ownBy(address user) public view onlyOwner returns (uint256[] memory) {
        return tokenIds[user];
    }
    
    function readCard(uint256 id) public view onlyOwner returns (string memory) {
        return cardFactory.tokenURI(id);
    }

}
