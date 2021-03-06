const resp = require("resp")
const { toWei, fromWei } = web3.utils;

function strArrToBytes(arr) {
    const res = web3.utils.fromAscii(resp.stringify(arr));
    return [res, arr.length];
}

function bytesToStr(arr) {
    return resp.parse(web3.utils.toAscii(arr))
}

/**
 * Calculates probability of outcomes given liquidity tokens.
 * @param {BN[]} liquidTokens
 * @returns {number[]}
 */
function getOdds(liquidTokens) {
    // Converts BN to Number. Note that this loses some precision but it is sufficient.
    liquidTokens = liquidTokens.map(x => (parseInt(x.toString())));

    const norm = (x) => Math.pow(x, 1 / liquidTokens.length);
    const V = liquidTokens.reduce((acc, x) => acc * norm(x), 1);
    const weights = liquidTokens.map(x => V / norm(x));
    const totalWeights = weights.reduce((acc, x) => acc + x, 0);

    return weights.map(x => x / totalWeights);
}

/**
 * Calculates the total portfolio value of the better.
 * It assumes that portfolio value << liquidity.
 * @param {BN[]} betShares
 * @param {BN[]} liquidTokens
 * @param {BN} totalAmount
 * @returns {number}
 */
function getPortfolioValue(betShares, liquidTokens, totalAmount){
    let value = 0;
    for(let i = 0; i < betShares.length; i ++){
        const price = getPrice(liquidTokens, totalAmount, i);
        value += price * betShares[i];
    }
    return value;
}


/**
 * Calculates the price of outcome tokens.
 * @param {BN[]} liquidTokens
 * @param {BN} totalAmount
 * @param {number} outcomeIdx
 * @returns {number}
 */
function getPrice(liquidTokens, totalAmount, outcomeIdx) {
    // Converts BN to Number. Note that this loses some precision but it is sufficient.
    liquidTokens = liquidTokens.map(x => (parseInt(x.toString())));
    totalAmount = parseInt(totalAmount.toString());

    const newPoolTokens = parseInt(toWei("1"));

    // all-asset deposit
    let B_t = liquidTokens[outcomeIdx] * ((totalAmount + newPoolTokens) / totalAmount);
    totalAmount += newPoolTokens;

    // single-asset withdrawal
    const W_t = liquidTokens.length;
    let outcomeTokens = B_t * (1 - (1 - newPoolTokens / totalAmount) ** W_t);

    const priceInWei = newPoolTokens / outcomeTokens;
    return parseFloat(fromWei(priceInWei.toString()));
}

module.exports.strArrToBytes = strArrToBytes;
module.exports.bytesToStr = bytesToStr;
module.exports.getOdds = getOdds;
module.exports.getPrice = getPrice;
module.exports.getPortfolioValue = getPortfolioValue;
