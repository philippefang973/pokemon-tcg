// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Card is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Card", "CRT") {}

    //Mint NFT given a user and a URI
    function assignCard(
        address user,
        string memory uri
    ) public returns (uint256) {
        uint256 newCardId = _tokenIds.current();
        _mint(user, newCardId);
        _setTokenURI(newCardId, uri);
        _tokenIds.increment();
        return newCardId;
    }

    //Get NFT metadata given an ID
    function metadata(uint256 cardId) public view returns (string memory) {
        return tokenURI(cardId);
    }
}
