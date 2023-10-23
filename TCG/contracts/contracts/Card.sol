// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Card is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Card", "CRT") {}

    function assignCard(
        address user,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 newCardId = _tokenIds.current();
        _mint(user, newCardId);
        _setTokenURI(newCardId, tokenURI);
        _tokenIds.increment();
        return newCardId;
    }
}
