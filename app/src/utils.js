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

