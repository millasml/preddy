import drizzleOptions from "./drizzleOptions";
import resp from "resp";
import { web3 } from "./drizzleOptions";

export function strArrToBytes(arr) {
  const res = web3.utils.fromAscii(resp.stringify(arr));
  return [res, arr.length];
}

export function bytesToStr(arr) {
  return resp.parse(web3.utils.toAscii(arr));
}

/**
 * Calculates probability of outcomes given liquidity tokens.
 * @param {BN[]} liquidTokens
 * @returns {number[]}
 */
export function getOdds(liquidTokens) {
  // Converts BN to Number. Note that this loses some precision but it is sufficient.
  liquidTokens = liquidTokens.map((x) => parseInt(x.toString()));

  const norm = (x) => Math.pow(x, 1 / liquidTokens.length);
  const V = liquidTokens.reduce((acc, x) => acc * norm(x), 1);
  const weights = liquidTokens.map((x) => V / norm(x));
  const totalWeights = weights.reduce((acc, x) => acc + x, 0);

  return weights.map((x) => x / totalWeights);
}

/**
 * Calculates the total portfolio value of the better.
 * It assumes that portfolio value << liquidity.
 * @param {BN[]} betShares
 * @param {BN[]} liquidTokens
 * @param {BN} totalAmount
 * @returns {number}
 */
export function getPortfolioValue(betShares, liquidTokens, totalAmount) {
  let value = 0;
  for (let i = 0; i < betShares.length; i++) {
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
export function getPrice(liquidTokens, totalAmount, outcomeIdx) {
  // get delta using 1 wei
  const ethIn = parseInt(web3.utils.toWei("1"));

  const outcomeTokens = getOutcomeTokensGivenEthIn(
    liquidTokens,
    totalAmount,
    outcomeIdx,
    ethIn
  );

  const priceInWei = ethIn / outcomeTokens;
  return parseFloat(web3.utils.fromWei(priceInWei.toString()));
}

export function getOddsForBet(
  totalTokens,
  liquidTokens,
  totalAmount,
  outcomeIdx,
  _ethIn
) {
  const ethIn = parseInt(web3.utils.toWei(_ethIn.toString(), "ether"));

  const outcomeTokens = getOutcomeTokensGivenEthIn(
    liquidTokens,
    totalAmount,
    outcomeIdx,
    ethIn
  );

  const outcomeShare =
    outcomeTokens / parseInt(web3.utils.fromWei(totalTokens[outcomeIdx]));
  const potentialWinnings = parseInt(totalAmount.toString()) * outcomeShare;
  const odds = potentialWinnings / ethIn;

  return odds;
}

function getOutcomeTokensGivenEthIn(
  liquidTokens,
  totalAmount,
  outcomeIdx,
  ethIn
) {
  // Converts BN to Number. Note that this loses some precision but it is sufficient.
  liquidTokens = liquidTokens.map((x) => parseInt(x.toString()));
  totalAmount = parseInt(totalAmount.toString());

  const newPoolTokens = ethIn;

  // all-asset deposit
  let B_t =
    liquidTokens[outcomeIdx] * ((totalAmount + newPoolTokens) / totalAmount);
  totalAmount += newPoolTokens;

  // single-asset withdrawal
  const W_t = liquidTokens.length;
  let outcomeTokens = B_t * (1 - (1 - newPoolTokens / totalAmount) ** W_t);

  return outcomeTokens;
}
