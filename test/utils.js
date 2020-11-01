function strArrToBytes(arr) {
    const charWidth = 2;
    const wordWidth = 64;
    const numChar = wordWidth / charWidth;

    let outcomes = [];
    let outcomeLengths = [];
    let x = 0;

    for (let str of arr) {
        for (let i = 0; i < Math.ceil(str.length / numChar); i++) {
            let subStr = str.slice(i * numChar, (i + 1) * numChar);
            let hex = web3.utils.utf8ToHex(subStr);
            outcomes.push(hex);
        }
        outcomeLengths.push(x);
        x += Math.ceil(str.length/ numChar);
    }

    return [outcomes, outcomeLengths];
}

function bytesToStr(arr, start, end) {
    arr = arr.slice(start, end);
    return arr.map(x => web3.utils.hexToUtf8(x)).join("");
}

module.exports.strArrToBytes = strArrToBytes;
module.exports.bytesToStr = bytesToStr;
