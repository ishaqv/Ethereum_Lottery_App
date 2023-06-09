// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Lottery {
    address public manager;
    uint private ticketPrice;
    address payable[] private buyers;
    address public winner;

    constructor() {
        manager = msg.sender;
        ticketPrice = 10000000 gwei; // === 0.01 ether
    }

    function setTicketPrice (uint price) public restricted {
        require(buyers.length == 0, 'You must set the ticket price before anyone buy the lottery');
        ticketPrice = price;
    }

    function buy() public payable {
        require(msg.value == ticketPrice, 'You must pay the ticket price to buy the lottery');
        buyers.push(payable(msg.sender));
    }

    function draw() public  restricted {
        require(buyers.length > 1, 'you can not to draw lottery until someone buys them');
        address payable lucky = buyers[random() % buyers.length];
        lucky.transfer(address(this).balance);
        buyers = new address payable[](0);
        winner = lucky;
    }

    function getBuyers() public view returns (address payable[] memory) {
        return buyers;
    }

    function getTicketPrice() public view returns (uint) {
        return ticketPrice / 1 gwei;
    }

    modifier restricted() {
        require(msg.sender == manager, 'You must be a manager');
        _;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, buyers)));
    }

}