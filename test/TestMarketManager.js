const MarketManager = artifacts.require("MarketManager");


contract("MarketManager", async accounts =>{
    it("should create a new prediction market", async() =>{
        let instance = await MarketManager.deployed();

        let asciiHex = web3.utils.asciiToHex("123456")
        let outcomes = web3.utils.hexToBytes(asciiHex)

        let outcomeLengths = [1, 2, 3]
        let arbiter = accounts[0]
        let description = "yet another prediction market"
        let resolutionUnixTime = 1604132297

        await instance.createMarket(
            outcomes, 
            outcomeLengths,
            arbiter,
            description,
            resolutionUnixTime,
            {from : arbiter}
        )

        let market = await instance.markets(accounts[0])
        assert.equal(market.arbiter, arbiter, "wrong arbiter")

    });

});