let utils = require('./utils');

const MarketManager = artifacts.require("MarketManager");
const Market = artifacts.require("Market");

contract("MarketManager", async accounts => {
    it("should create a new prediction market", async () => {
        let instance = await MarketManager.deployed();

        let outcomeStrings = ["win", "lose", "draw"]
        let [outcomes, outcomeLengths] = utils.strArrToHex(outcomeStrings)

        let arbiter = accounts[0]
        let description = "yet another prediction market"
        let resolutionUnixTime = 1604132297

        await instance.createMarket(
            outcomes,
            outcomeLengths,
            arbiter,
            description,
            resolutionUnixTime,
            {from: arbiter}
        )

        let marketAddress = await instance.markets(accounts[0])
        let market = await Market.at(marketAddress)

        assert.equal(await market.resolutionUnixTime(), resolutionUnixTime, "wrong resolution time")
        assert.equal(await market.arbiter(), arbiter, "wrong arbiter")
        assert.equal(await market.description(), description, "wrong description")
        assert.equal(await market.getStatus(), "Open", "wrong status")
        for(let i = 0; i < outcomeStrings.length; i++){
            assert.equal(await market.outcomes(i), outcomeStrings[i], "wrong outcome string")
        }

    });

});
