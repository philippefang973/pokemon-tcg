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
    mapping(address => uint256) private boosterId;
    Card private cardFactory;

    event getCardContractAddress(address res);

    constructor() {
        cardFactory = new Card();
        console.log(address(cardFactory));
        emit getCardContractAddress(address(cardFactory));
    }

    //Create a collection given a name and a count
    function createCollection(
        string memory name,
        int cardCount
    ) public returns (string memory) {
        collections[name] = new Collection(name, cardCount);
        console.log(name);
        return name;
    }

    //Create a card in collection
    function createCard(
        string memory collectionName,
        string memory cardName,
        string memory cardURI
    ) public onlyOwner {
        collections[collectionName].setCard(cardName, cardURI);
        console.log(collections[collectionName].getCardInfo(cardName));
    }

    //Create multiple cards in a collection
    function createMultipleCards(
        string memory collectionName,
        string[] memory cardNames,
        string[] memory cardURIs
    )  public onlyOwner {
        for (uint i = 0; i < cardNames.length; i++) {
            collections[collectionName].setCard(cardNames[i],cardURIs[i]);
        }
    }

    //Mint NFT
    function assign(
        string memory collectionName,
        string memory cardName,
        address user
    ) public onlyOwner {
        string memory cardMetadata = collections[collectionName].getCardInfo(cardName);
        uint256 newCardId = cardFactory.assignCard(user, cardMetadata);
        tokenIds[user].push(newCardId);
    }

    //Mint multiple NFTs
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

    //Get NFT IDs own by a user
    function ownBy(address user) public view onlyOwner returns (uint256[] memory) {
        return tokenIds[user];
    }
    
    //Get NFT metadata
    function readCard(uint256 id) public view onlyOwner returns (string memory) {
        return cardFactory.tokenURI(id);
    }

    //Create booster given card names and each of their collection
    function createBooster(
        string[] memory cardNames,
        string[] memory collectionNames,
        address user
    ) public onlyOwner {
        string memory resUri = '';
        for (uint i = 0; i < cardNames.length; i++) {
            string memory cardMetadata = collections[collectionNames[i]].getCardInfo(cardNames[i]);
            resUri = string(abi.encodePacked(resUri,"::"));
            resUri = string(abi.encodePacked(resUri,cardMetadata));
        } 
        uint256 newCardId = cardFactory.assignCard(user, resUri);
        boosterId[user] = newCardId;
    }

    //Get booster NFT's URI
    function redeemBooster(address user) public view onlyOwner returns (string memory){
        return cardFactory.tokenURI(boosterId[user]);
    }

    //Get all NFTs of list of users
    function showAll(address[] memory users) public view onlyOwner returns (string[][] memory){
        string[][] memory res = new string[][](users.length);
        for (uint i = 0; i < users.length; i++) {
            uint256[] memory tokens = tokenIds[users[i]];
            string[] memory tmp = new string[](tokens.length);
            for (uint j = 0; j < tokens.length; j++) {
                string memory uri = cardFactory.tokenURI(tokens[j]);
                tmp[j] = uri;
            }
            res[i] = tmp;
        }
        return res;
    }

    //Get NFTs of user
    function showUser(address user) public view onlyOwner returns (string[] memory){
        string[] memory res = new string[](tokenIds[user].length);
        for (uint i = 0; i < tokenIds[user].length; i++) {
            res[i] = cardFactory.tokenURI(tokenIds[user][i]);
        }
        return res;
    }

}
