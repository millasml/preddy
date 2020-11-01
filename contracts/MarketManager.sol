// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

import {Market} from "./Market.sol";

contract MarketManager {
    mapping(address => Market) public markets;
    uint24 reportWindow;

    constructor(uint24 _reportWindow) public {
        reportWindow = _reportWindow;
    }

    function createMarket(
        bytes memory _serializedOutcomes,
        uint256[] memory _outcomeLengths,
        address _arbiter,
        string memory _question,
        string memory _description,
        uint256 _resolutionUnixTime
    ) public {
        Market market = new Market(
            _serializedOutcomes,
            _outcomeLengths,
            _arbiter,
            _question,
            _description,
            _resolutionUnixTime
        );

        markets[msg.sender] = market;
    }
}
