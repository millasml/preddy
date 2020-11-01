let utils = require('./utils');

const MarketManager = artifacts.require("MarketManager");
const Market = artifacts.require("Market");

contract("MarketManager", async accounts => {
    it("should create a new prediction market", async () => {
        let instance = await MarketManager.deployed();
        let longString = ` Commerce on the Internet has come to rely almost exclusively on financial institutions serving as
                trusted third parties to process electronic payments. While the system works well enough for
                most transactions, it still suffers from the inherent weaknesses of the trust based model.
                Completely non-reversible transactions are not really possible, since financial institutions cannot
                avoid mediating disputes. The cost of mediation increases transaction costs, limiting the
                minimum practical transaction size and cutting off the possibility for small casual transactions,
                and there is a broader cost in the loss of ability to make non-reversible payments for nonreversible services. With the possibility of reversal, the need for trust spreads. Merchants must
                be wary of their customers, hassling them for more information than they would otherwise need.
                A certain percentage of fraud is accepted as unavoidable. These costs and payment uncertainties
                can be avoided in person by using physical currency, but no mechanism exists to make payments
                over a communications channel without a trusted party.`

        let outcomeStrings = ["win", "lose", "draw", longString];
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
            {from: arbiter}
        )

        let marketAddress = await instance.markets(accounts[0])
        let market = await Market.at(marketAddress)

        assert.equal(await market.resolutionTimestamp(), resolutionUnixTime, "wrong resolution time")
        assert.equal(await market.arbiter(), arbiter, "wrong arbiter")
        assert.equal(await market.question(), question, "wrong question")
        assert.equal(await market.description(), description, "wrong description")
        assert.equal(await market.getStatus(), "Open", "wrong status")
        assert.equal(await market.getNumOutcome(), outcomeStrings.length, "wrong number of outcomes")

        for(let i = 0; i < outcomeStrings.length; i++){
            let {0: returnOutcomes, 1: start, 2: end} = await market.getOutcome(i)
            let outcome = utils.bytesToStr(returnOutcomes, start, end)
            assert.equal(outcome, outcomeStrings[i], "wrong outcome string")
        }
    });

});
