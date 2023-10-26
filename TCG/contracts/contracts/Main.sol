// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Collection.sol";
import "./Card.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
    mapping(string => Collection) private collections;
    Card private cardFactory;

    constructor() {
        cardFactory = new Card();
    }

    receive() external payable {
        // This function is called when Ether is sent to the contract
        // It can be used to receive and process the incoming Ether
        // In this example, we'll simply log the sender and the amount received.
        address sender = msg.sender;
        uint256 amount = msg.value;

        emit Received(sender, amount);

        // You can add your custom logic here to handle the received Ether.
    }

    // Event to log received Ether
    event Received(address indexed sender, uint256 amount);
    
    function createCollection(string memory name, int cardCount) public {
        collections[name] = new Collection(name, cardCount);
    }

    function createCard(
        string memory collectionName,
        string memory cardName,
        string memory cardURI
    ) external onlyOwner {
        collections[collectionName].setCard(cardName, cardURI);
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
