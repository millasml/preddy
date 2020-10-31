let utils = require('./utils');
const MarketManager = artifacts.require("MarketManager");
const Market = artifacts.require("Market");

contract("Market", async accounts => {
    let market;

    before(async () => {
        let instance = await MarketManager.deployed();

        let outcomeStrings = ["Binjai", "Banyan", "Hall 6", "Tamarind"];
        let [outcomes, outcomeLengths] = utils.strArrToHex(outcomeStrings);
        let arbiter = accounts[0];
        let description = "Which is the best hall in North Hill?";
        let resolutionUnixTime = 1604132297;

        await instance.createMarket(
            outcomes,
            outcomeLengths,
            arbiter,
            description,
            resolutionUnixTime,
            {from: arbiter}
        );

        let marketAddress = await instance.markets(accounts[0]);
        market = await Market.at(marketAddress);
    })

    it("should place bet", async () => {
        // test variables
        let outcomeIdx = 0;
        let better = accounts[0];
        let betValue = "1";

        await market.placeBet(outcomeIdx, {from: better, value: web3.utils.toWei(betValue, "ether")});
        let {0: betExists, 1: actualValue} = await market.getBet(better, outcomeIdx);
        actualValue = web3.utils.fromWei(actualValue.toString(), "ether")

        assert.isTrue(betExists, "bet not updated in market")
        assert.equal(betValue, actualValue, "bet value is invalid")
    });

    it("should not resolve market as account is not arbiter", async () => {
        try {
            await market.resolve(0, {from: accounts[1]});
        } catch (e) {
            assert.include(e.message, "only arbiter can resolve the market", "wrong error type");
        }
    });

    it("should resolve market", async () => {
        // place additional bets
        await market.placeBet(0, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        await market.placeBet(1, {from: accounts[2], value: web3.utils.toWei("2", "ether")});

        // resolve
        await market.resolve(0, {from: accounts[0]});

        let getResult = async (account) => {
            let result = await market.getResult(account);
            return result.toString();
        };

        assert.equal(await market.getStatus(), "Close", "wrong status");
        assert.equal(await getResult(accounts[0]), web3.utils.toWei("2", "ether"), "wrong win amount")
        assert.equal(await getResult(accounts[1]), web3.utils.toWei("2", "ether"), "wrong win amount")
        assert.equal(await getResult(accounts[2]), 0, "wrong lose amount")
    });

    it("should not resolve twice", async () => {
        try {
            await market.resolve(0, {from: accounts[0]});
        } catch (e) {
            assert.include(e.message, "market has already been resolved", "wrong error type");
        }
    });

    it("should complete withdrawal", async () => {
        let balance = await web3.eth.getBalance(accounts[0]);
        await market.withdraw({from: accounts[0]});
        let actualBalance = await web3.eth.getBalance(accounts[0]);

        assert.isAbove(parseInt(actualBalance), parseInt(balance), "wrong withdrawal result")
    });

});
