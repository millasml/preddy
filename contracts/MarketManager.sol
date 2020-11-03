// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

import {Market} from "./Market.sol";

contract MarketManager {
    Market[] public markets;
    uint256 reportWindow;

    constructor(uint256 _reportWindow) public {
        reportWindow = _reportWindow;
    }

    function createMarket(
        bytes memory _outcomes,
        uint256 _outcomeCount,
        uint256[] memory _initialMarket,
        address _arbiter,
        string memory _question,
        string memory _description,
        uint256 _resolutionUnixTime
    ) public payable {
        require(_outcomeCount > 1, "there should be at least 2 outcomes");
        Market market = (new Market).value(msg.value)(
            _outcomes,
            _outcomeCount,
            _initialMarket,
            _arbiter,
            _question,
            _description,
            _resolutionUnixTime
        );

        markets.push(market);
    }

    // function that returns all arrays
    function getMarkets() public view returns (Market[] memory) {
        return markets;
    }
}
