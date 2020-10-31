// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

import {Seriality} from "./Seriality/src/Seriality.sol";

contract Market is Seriality {
    /**
    Hard Requirement
    Users can open new topic (a new prediction market) with 
    - descriptions, 
    - outcome options to bet on, 
    - variable amount on each bet
    - resolution date & time
    - arbitrator identity (the trusted judge after the event occurs).
    */

    mapping(address => Bets) public bets;
    bool open;
    uint256 totalAmount;
    mapping(uint256 => uint256) outcomeToAmount;
    mapping(address => uint256) result;
    string[] public outcomes;
    string public description;
    uint256 public resolutionUnixTime;
    address public arbiter;
    address[] public betters;

    struct Bets {
        bool exists;
        // mapping of outcomeIdx => amount
        mapping(uint256 => uint256) outcomes;
    }

    constructor(
        bytes memory _serializedOutcomes,
        uint256[] memory _outcomeLengths,
        address _arbiter,
        string memory _description,
        uint256 _resolutionUnixTime
    ) public {
        uint256 offset = _serializedOutcomes.length;
        for (uint256 i = 0; i < _outcomeLengths.length; i++) {
            string memory outcome = new string(_outcomeLengths[i]);
            bytesToString(offset, _serializedOutcomes, bytes(outcome));
            offset -= sizeOfString(outcome);
            outcomes.push(outcome);
        }
        arbiter = _arbiter;
        description = _description;
        resolutionUnixTime = _resolutionUnixTime;
        open = true;
    }

    function placeBet(uint256 outcomeIdx) public payable {
        if (!bets[msg.sender].exists) {
            betters.push(msg.sender);
            bets[msg.sender].exists = true;
        }
        bets[msg.sender].outcomes[outcomeIdx] += msg.value;
        outcomeToAmount[outcomeIdx] += msg.value;
        totalAmount += msg.value;
    }

    function getBet(address better, uint256 outcomeIdx) public view returns (bool, uint256) {
        return (bets[better].exists, bets[better].outcomes[outcomeIdx]);
    }

    function getResult(address better) public view returns (uint256) {
        return result[better];
    }

    function resolve(uint256 outcomeIdx) public {
        if (msg.sender != arbiter) {
            return;
        }
        // if nobody wins, arbiter gets everything
        if (outcomeToAmount[outcomeIdx] == 0) {
            result[arbiter] = totalAmount;
        }
        else {
            uint256 pot = totalAmount - outcomeToAmount[outcomeIdx];
            for (uint256 i = 0; i < betters.length; i++) {
                address better = betters[i];
                uint256 betAmount = bets[better].outcomes[outcomeIdx];
                uint256 winAmount = ((betAmount / outcomeToAmount[outcomeIdx]) * pot) + betAmount;
                result[better] = winAmount;
            }
        }
        open = false;
    }

    function withdraw() public {
        if (open) {
            return;
        }
        uint amount = result[msg.sender];
        result[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}

























