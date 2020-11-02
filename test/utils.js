const resp = require("resp")

function strArrToBytes(arr) {
    const res = web3.utils.fromAscii(resp.stringify(arr));
    return [res, arr.length];
}

function bytesToStr(arr) {
    return resp.parse(web3.utils.toAscii(arr))
}

module.exports.strArrToBytes = strArrToBytes;
module.exports.bytesToStr = bytesToStr;
