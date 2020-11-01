function hexToStr(hex) {
	var str = '';
	for (var i = 0; i < hex.length; i += 2) {
	   var v = parseInt(hex.substr(i, 2), 16);
	   if (v) str += String.fromCharCode(v);
	}

  	params = [];
	res = "";
	for (var i=0; i<= str.length; i++){
		if(str.charCodeAt(i) > 31){
			res = res + str[i];
		}
		else{
			params.push(res);
			res = "";
		}
	}
	params.pop();

  return params;
}

function strToHex(str) {
    return str.split("")
                .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("");
}

function strArrToHex(arr){
	// input: array of strings
	// output[0]: serialization of array of strings
	// output[1]: array of string byte sizes

	let reversedArr = arr.slice().reverse()
	let result = ""
	let sizes = []

	for(let str of reversedArr){
		let hexStr = serialityStrToHex(str)
		result += hexStr
		sizes.push(hexStr.length)
	}

	result = "0x" + result
	return [result, sizes]
}

function serialityStrToHex(str){
	let bitWidth = 64
	let hexSize = str.length.toString(16).padStart(bitWidth, "0")
	let hexStr = str.split("")
                .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("");

	let size = Math.ceil(hexStr.length / bitWidth) * bitWidth
	hexStr = hexStr.padEnd(size, "0")
	hexStr = hexStr + hexSize
	return hexStr
}

module.exports.strArrToHex = strArrToHex