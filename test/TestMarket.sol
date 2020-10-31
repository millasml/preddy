pragma solidity >=0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Market.sol";
import "../contracts/Seriality/src/Seriality.sol";

contract TestMarket is Seriality {
    uint public initialBalance = 1 ether;
    Market market;

    function beforeAll() public {
        string[] memory outcomes = new string[](2);
        outcomes[0] = "win";
        outcomes[1] = "lose";
        string memory description = "test prediction market";
        uint256 resolutionUnixTime = block.timestamp;
        bytes memory buffer = new bytes(200);
        uint256[] memory outcomeLengths = new uint256[](2);
        address arbiter;
        uint256 offset = 200;
        for (uint256 i = 0; i < outcomes.length; i++) {
            stringToBytes(offset, bytes(outcomes[i]), buffer);
            offset -= sizeOfString(outcomes[i]);
            outcomeLengths[i] = sizeOfString(outcomes[i]);
        }
        Assert.equal(
            outcomeLengths.length,
            outcomes.length,
            "outcomeLengths should be same length as outcomes"
        );
        market = new Market(
            buffer,
            outcomeLengths,
            arbiter,
            description,
            resolutionUnixTime
        );
        for (uint256 i = 0; i < outcomes.length; i++) {
            Assert.equal(
                market.outcomes(i),
                outcomes[i],
                "outcomes should be the same"
            );
        }
    }

    function testBetAmountIsRegistered() public {
        market.placeBet.value(10)(0);
        (bool exists, uint256 amount) = market.getBet(address(this), 0);

        Assert.isTrue(exists, "better should exist");
        Assert.equal(10, amount, "bet amount should be 10");
    }

}
