// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

import {Market} from "./Market.sol";

contract MarketManager {
    mapping(address => Market) public markets;
    uint reportWindow;

    constructor(uint _reportWindow) public {
        reportWindow = _reportWindow;
    }

    function createMarket(
        bytes memory _outcomes,
        uint256 outcomeCount,
        address _arbiter,
        string memory _question,
        string memory _description,
        uint256 _resolutionUnixTime
    ) public {
        Market market = new Market(
            _outcomes,
            outcomeCount,
            _arbiter,
            _question,
            _description,
            _resolutionUnixTime
        );

        markets[msg.sender] = market;
    }
}
