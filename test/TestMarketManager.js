let utils = require('./utils');

const MarketManager = artifacts.require("MarketManager");
const Market = artifacts.require("Market");

contract("MarketManager", async accounts => {
    it("should create a new prediction market", async () => {
        let instance = await MarketManager.deployed();
        let outcomeStrings = ["win", "lose", "draw"];
        let [outcomes, outcomeLengths] = utils.strArrToBytes(outcomeStrings)
        let arbiter = accounts[0]
        let question = "What?"
        let description = "yet another prediction market"
        let resolutionUnixTime = 1604132297

        await instance.createMarket(
            outcomes,
            outcomeLengths,
            arbiter,
            question,
            description,
            resolutionUnixTime,
            {from: arbiter, gas: 2000000}
        )

        let marketAddress = await instance.markets(0)
        let market = await Market.at(marketAddress)

        assert.equal(await market.resolutionTimestamp(), resolutionUnixTime, "wrong resolution time")
        assert.equal(await market.arbiter(), arbiter, "wrong arbiter")
        assert.equal(await market.question(), question, "wrong question")
        assert.equal(await market.description(), description, "wrong description")
        assert.equal(await market.getStatus(), "Open", "wrong status")
        assert.equal(await market.getNumOutcome(), outcomeStrings.length, "wrong number of outcomes")

        let expectedOutcomeStrings = utils.bytesToStr(await market.outcomes());
        assert.deepEqual(expectedOutcomeStrings, outcomeStrings, "wrong outcome strings")
    });

});
