const utils = require("./utils")

const { toWei } = web3.utils;
const BN = web3.utils.toBN;

describe("Utils", async () => {
    it("should have correct probability distribution", () => {
        const liquidTokens = [27, 8, 1].map(x => BN(x));
        const expected = [2 / 11, 3 / 11, 6 / 11];
        const actual = utils.getOdds(liquidTokens);
        assert.deepEqual(actual, expected, "wrong probability distribution");
    });

    it("should have correct price", () => {
        const liquidTokens = [27, 8, 1].map(x => BN(x));
        const totalAmount = BN(toWei("100"));
        const outcomeIdx = 0;
        const expected = 1.246872429;
        const actual = utils.getPrice(liquidTokens, totalAmount, outcomeIdx);

        assert.equal(actual.toFixed(4), expected.toFixed(4), "wrong probability distribution");
    });
});
