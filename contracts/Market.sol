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
    Status status;
    uint256 totalAmount;
    mapping(uint256 => uint256) outcomeToAmount;
    mapping(address => uint256) result; // stores winnings in Wei
    string[] public outcomes;
    string public question;
    string public description;
    uint256 public resolutionTimestamp;
    address public arbiter;
    address[] public betters;

    struct Bets {
        bool exists;
        // mapping of outcomeIdx => amount
        mapping(uint256 => uint256) outcomes;
    }

    enum Status {Open, Close, Resolved}

    constructor(
        bytes memory _serializedOutcomes,
        uint256[] memory _outcomeLengths,
        address _arbiter,
        string memory _question,
        string memory _description,
        uint256 _resolutionTimestamp
    ) public {
        uint256 offset = _serializedOutcomes.length;
        for (uint256 i = 0; i < _outcomeLengths.length; i++) {
            string memory outcome = new string(_outcomeLengths[i]);
            bytesToString(offset, _serializedOutcomes, bytes(outcome));
            offset -= sizeOfString(outcome);
            outcomes.push(outcome);
        }
        arbiter = _arbiter;
        question = _question;
        description = _description;
        resolutionTimestamp = _resolutionTimestamp;
        status = Status.Open;
    }

    // Perform timed transitions. Be sure to mention
    // this modifier first, otherwise the guards
    // will not take the new stage into account.
    modifier timedTransitions() {
        if (status == Status.Open && block.timestamp >= resolutionTimestamp){
            status = Status.Close;
        }
        _;
    }

    function getStatus() public view returns (string memory){
        if(status == Status.Close){
            return "Close";
        } else if (status == Status.Open){
            return "Open";
        } else {
            return "Resolved";
        }
    }
    function getBet(address better, uint256 outcomeIdx) public view returns (bool, uint256) {
        return (bets[better].exists, bets[better].outcomes[outcomeIdx]);
    }

    function getResult(address better) public view returns (uint256) {
        return result[better];
    }

    function placeBet(uint256 outcomeIdx) public timedTransitions payable {
        require(status == Status.Open, "market is not open for bets");

        if (!bets[msg.sender].exists) {
            betters.push(msg.sender);
            bets[msg.sender].exists = true;
        }
        bets[msg.sender].outcomes[outcomeIdx] += msg.value; // pls note this is in Wei
        outcomeToAmount[outcomeIdx] += msg.value;
        totalAmount += msg.value;
    }

    function resolve(uint256 outcomeIdx) public timedTransitions {
        require(status == Status.Close, "market is not ready to be resolved");
        require(msg.sender == arbiter, "only arbiter can resolve the market");

        // if nobody wins, arbiter gets everything
        if (outcomeToAmount[outcomeIdx] == 0) {
            result[arbiter] = totalAmount;
        }
        else {
            uint256 pot = totalAmount - outcomeToAmount[outcomeIdx];
            for (uint256 i = 0; i < betters.length; i++) {
                address better = betters[i];
                uint256 betAmount = bets[better].outcomes[outcomeIdx];
                uint256 winAmount = pot * betAmount / outcomeToAmount[outcomeIdx];
                result[better] = winAmount + betAmount;
            }
        }

        status = Status.Resolved;
    }

    function withdraw() public timedTransitions {
        require(status == Status.Resolved, "market has not been resolved");

        uint amount = result[msg.sender];
        result[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

}


























