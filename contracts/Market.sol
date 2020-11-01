// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

import {Utils} from "./Utils.sol";

contract Market is Utils {
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
    string public question;
    bytes32[] outcomes;
    uint256[] outcomeLengths;
    string public description;
    uint256 public resolutionTimestamp;
    address public arbiter;
    address[] public betters;

    // liquidity
    uint256 productConst;
    uint256[] tokenCounts;
    uint256 tokenTotal;


    struct Bets {
        bool exists;
        // mapping of outcomeIdx => amount
        mapping(uint256 => uint256) outcomes;
    }

    enum Status {Open, Close, Resolved}

    constructor(
        bytes32[] memory _outcomes,
        uint256[] memory _outcomeLengths,
        uint256[] memory initialMarket,
        address _arbiter,
        string memory _question,
        string memory _description,
        uint256 _resolutionTimestamp
    ) public payable {
        outcomes = _outcomes;
        outcomeLengths = _outcomeLengths;
        arbiter = _arbiter;
        question = _question;
        description = _description;
        resolutionTimestamp = _resolutionTimestamp;
        status = Status.Open;

        productConst = 1;
        tokenTotal = 0;
        tokenCounts = new uint256[](initialMarket.length);
        copy(initialMarket, tokenCounts);
        for (uint i=0; i<initialMarket.length; i++) {
            require(initialMarket[i] != 0, "Initial market options must be >0");
            productConst *= initialMarket[i];
            tokenTotal += initialMarket[i];
        }
        require(tokenTotal != 10000, "Initial market options must sum to 10000");
        totalAmount = msg.value;
    }

    // Perform timed transitions. Be sure to mention
    // this modifier first, otherwise the guards
    // will not take the new stage into account.
    modifier timedTransitions() {
        if (status == Status.Open && block.timestamp >= resolutionTimestamp) {
            status = Status.Close;
        }
        _;
    }

    function getNumOutcome() public view returns (uint256){
        return outcomeLengths.length;
    }

    function getOutcome(uint256 i) public view returns (bytes32[] memory, uint256, uint256){
        uint256 start = i == 0 ? 0 : outcomeLengths[i];
        uint256 end = i == outcomeLengths.length - 1 ? outcomes.length : outcomeLengths[i + 1];
        return (outcomes, start, end);
    }

    function getStatus() public view returns (string memory){
        if (status == Status.Close) {
            return "Close";
        } else if (status == Status.Open) {
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

    function calcNewTokens(uint256 betAmount) view internal returns (uint256) {
        return betAmount * (totalAmount / tokenTotal) / outcomes.length;
    }

    // returns percentage (i.e. 1056 => 10.56%)
    function getPrediction(uint256 outcomeIdx) public view returns (uint256) {
        return tokenCounts[outcomeIdx] / tokenTotal * 100;
    }

    function placeBet(uint256 outcomeIdx) public timedTransitions payable {
        require(status == Status.Open, "market is not open for bets");
        uint256 newTokens = calcNewTokens(msg.value);
        if (newTokens == 0) {
            revert("value less than minimum bet");
        }
        uint256 newProduct = 1;
        for (uint i=0; i<tokenCounts.length; i++) {
            if (i != outcomeIdx) {
                tokenCounts[i] += newTokens;
                newProduct *= tokenCounts[i];
            }
        }
        uint256 newOutcomeTokenCount = productConst / newProduct;
        uint256 betterTokenCount = newTokens + tokenCounts[outcomeIdx] - newOutcomeTokenCount;
        if (!bets[msg.sender].exists) {
            betters.push(msg.sender);
            bets[msg.sender].exists = true;
        }
        bets[msg.sender].outcomes[outcomeIdx] += betterTokenCount;
        // pls note this is in Wei
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
            for (uint256 i = 0; i < betters.length; i++) {
                address better = betters[i];
                uint256 winTokens = bets[better].outcomes[outcomeIdx];
                uint256 winAmount = totalAmount * winTokens / tokenTotal;
                result[better] = winAmount;
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


























