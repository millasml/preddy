import drizzleOptions from "./drizzleOptions";
import resp from 'resp'

const web3 = drizzleOptions.web3.customProvider;

export function strArrToBytes(arr) {
    const res = web3.utils.fromAscii(resp.stringify(arr));
    return [res, arr.length];
}

export function bytesToStr(arr) {
    return resp.parse(web3.utils.toAscii(arr))
}

/**
 *
 * @param liquidTokens array of BN
 * @returns {number[]} array of probabilities at each index
 */
export function getOdds(liquidTokens) {
    const norm = (x) => Math.pow(x, 1 / liquidTokens.length);
    liquidTokens = liquidTokens.map(x => (parseInt(x.toString())));

    const V = liquidTokens.reduce((acc, x) => acc * norm(x), 1);
    const weights = liquidTokens.map(x => V / norm(x));
    const totalWeights = weights.reduce((acc, x) => acc + x, 0);

    return weights.map(x => x / totalWeights);
}
