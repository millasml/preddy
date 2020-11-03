// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

import {BMath} from "./balancer-core/BMath.sol";

contract Market is BMath {
    /**
    Hard Requirement
    Users can open new topic (a new prediction market) with 
    - descriptions, 
    - outcome options to bet on, 
    - variable amount on each bet
    - resolution date & time
    - arbitrator identity (the trusted judge after the event occurs).
    */

    struct Bets {
        bool active;
        uint256[] outcomes;
    }

    enum Status {Open, Close, Resolved}

    // immutable properties
    string public question;
    bytes public outcomes;
    uint256 public outcomeCount;
    string public description;
    uint256 public resolutionTimestamp;
    address public arbiter;

    // market state variables
    Status status;
    mapping(address => Bets) public bets;
    mapping(uint256 => uint256) outcomeToAmount;
    uint256 result; // resolved outcome
    address[] public betters;

    // tokenCount[i] is the number of liquid tokens in outcome[i]
    uint256[] tokenCounts;
    // totalAmount is the wei of all bets.
    // it is also the pool token in the Balancer scheme.
    uint256 totalAmount;
    // tokenWeight is the reciprocal of outcomeCount
    uint256 tokenWeight;

    constructor(
        bytes memory _outcomes,
        uint256 _outcomeCount,
        uint256[] memory initialMarket,
        address _arbiter,
        string memory _question,
        string memory _description,
        uint256 _resolutionUnixTime
    ) public payable {
        outcomes = _outcomes;
        // for (uint256 i = 0; i < _outcomes.length; i++) {
        //     outcomes.push(_outcomes[i]);
        // }
        outcomeCount = _outcomeCount;
        arbiter = _arbiter;
        question = _question;
        description = _description;
        resolutionTimestamp = _resolutionUnixTime;
        status = Status.Open;

        uint256 tokenTotal = 0;
        uint256 poolTokens = itob(msg.value);
        for (uint256 i = 0; i < initialMarket.length; i++) {
            require(initialMarket[i] != 0, "Initial market options must be >0");
            uint256 _tokens = itob(initialMarket[i]);
            tokenCounts.push(_tokens);
            tokenTotal = badd(tokenTotal, _tokens);
        }
        // we require the sum of tokens to equal the amount of wei sent in
        // this ensures we maintain a reasonable amount of accuracy
        // require(
        //     tokenTotal != poolTokens,
        //     "Initial market options must sum to value sent"
        // );
        totalAmount = poolTokens;
        tokenWeight = BONE / outcomeCount;
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

    function getStatus() public view returns (string memory) {
        if (status == Status.Close) {
            return "Close";
        } else if (status == Status.Open) {
            return "Open";
        } else {
            return "Resolved";
        }
    }

    function getBetShares(address better)
        public
        view
        returns (uint256[] memory)
    {
        return bets[better].outcomes;
    }

    function getTokenCounts() public view returns (uint256[] memory) {
        return tokenCounts;
    }

    // returns array representing better's holdings in terms of wei
    function getBetterValues(address better)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory values = new uint256[](outcomeCount);
        for (uint256 i = 0; i < tokenCounts.length; i++) {
            if (status == Status.Resolved) {
                if (i == result) {
                    uint256 share = bdiv(
                        tokenCounts[i],
                        bets[better].outcomes[i]
                    );
                    uint256 value = bmul(totalAmount, share);
                    values[i] = value;
                } else {
                    values[i] = 0;
                }
            } else {
                uint256 share = bets[better].outcomes[i];
                if (share == 0) {
                    values[i] = 0;
                } else {
                    uint256 shareValue = calcPoolOutGivenSingleIn(
                        tokenCounts[i],
                        tokenWeight,
                        totalAmount,
                        BONE,
                        share,
                        0
                    );
                    values[i] = shareValue;
                }
            }
        }
        return values;
    }

    function placeBet(uint256 outcomeIdx) public payable timedTransitions {
        require(status == Status.Open, "market is not open for bets");
        // register new better if needed
        if (!bets[msg.sender].active) {
            betters.push(msg.sender);
            bets[msg.sender].active = true;
            uint256[] memory _outcomes = new uint256[](outcomeCount);
            bets[msg.sender].outcomes = _outcomes;
        }
        // Do adjustments to all tokens as a "liquidity event"
        uint256 newPoolTokens = itob(msg.value);
        for (uint256 i = 0; i < tokenCounts.length; i++) {
            uint256 extraTokens = calcNewTokenForPoolDeposit(
                newPoolTokens,
                totalAmount,
                tokenCounts[i]
            );
            tokenCounts[i] += extraTokens;
        }
        totalAmount += newPoolTokens;
        // Using the above pool tokens, convert all into outcomeIdx tokens
        uint256 outcomeShareTokens = calcSingleOutGivenPoolIn(
            tokenCounts[outcomeIdx],
            tokenWeight,
            totalAmount,
            BONE,
            newPoolTokens,
            0 // TODO: add swap fee?
        );
        bets[msg.sender].outcomes[outcomeIdx] += outcomeShareTokens;
        tokenCounts[outcomeIdx] = bsub(
            tokenCounts[outcomeIdx],
            outcomeShareTokens
        );
    }

    function getWinnings(address better) public view returns (uint256) {
        require(status == Status.Resolved, "market is not resolved yet");
        uint256 share = bdiv(
            tokenCounts[result],
            bets[better].outcomes[result]
        );
        uint256 value = bmul(totalAmount, share);
        return btoi(value);
    }

    function resolve(uint256 outcomeIdx) public timedTransitions {
        require(status == Status.Close, "market is not ready to be resolved");
        require(msg.sender == arbiter, "only arbiter can resolve the market");

        // TODO: fee?

        result = outcomeIdx;
        status = Status.Resolved;
    }

    function withdraw() public timedTransitions {
        require(status == Status.Resolved, "market has not been resolved");
        require(bets[msg.sender].active, "no active bet found");

        uint256 amount = getWinnings(msg.sender);
        bets[msg.sender].active = false;
        msg.sender.transfer(amount);
    }
}
