/**
 * “Numeric Character Reference”
 */
var NCR = new function NCR() {
	var leadAdd = 0xD800, trailAdd = 0xDC00, ncrSubtract = 0x10000

	
	/**
	 * 將U+10000到U+10FFFF的碼位轉為字元值參照 (Numeric Character Reference, NCR)
	 * 
	 * @param hexadecimal 是否輸出成 16 進制的 NCR
	 */
	function encodeUTF16(leadSurrogates: number, trailSurrogates: number, hexadecimal: boolean  = false) {
		if (leadSurrogates < leadAdd || trailSurrogates < trailAdd) {
			return String.fromCharCode(leadSurrogates) + String.fromCharCode(trailSurrogates)
		}
		
		leadSurrogates -= leadAdd
		trailSurrogates -= trailAdd
		var ncrNum = (leadSurrogates * 1024 + trailSurrogates) + ncrSubtract
		if(hexadecimal){
			return "&#x" + ncrNum.toString(16) + ";"
		}
		return "&#" + ncrNum + ";"
	}
	
	/**
	 * 將NCR 轉為字元
	 * 
	 */
	function decodeUTF16(num: number): string {
		var lead, trail;
		num -= ncrSubtract;
		lead = Math.floor(num / 1024) + leadAdd;
		trail = num % 1024 + trailAdd;
		return String.fromCharCode(lead) + String.fromCharCode(trail)
	}
	
	/**
	 * 將字串 str 特殊字元編譯成字元值參照 (Numeric Character Reference, NCR)
	 * 
	 * @param hexadecimal 是否輸出成 16 進制的 NCR
	 */
	this.encode = function (str: string, hexadecimal: boolean = false): string{
		for(var i = 0; i < str.length; i++){
			if(str.charCodeAt(i) >= leadAdd && str.charCodeAt(i + 1) >= trailAdd){
				str = str.replace(
					str.substr(i, 2),
					encodeUTF16(
						str.charCodeAt(i),
						str.charCodeAt(i + 1),
						hexadecimal
					)
				)
			}else if(str.charCodeAt(i) >= 0x007f){
				str = str.replace(
					str.substr(i, 1),
					"&#" + str.charCodeAt(i) + ";"
				)
			}
			
		}
		return str
	}
	
	this.decode = function (str: string): string{
		return str
			.replace(/&#x(\w*);/g, function (match, s) {
				var num = parseInt(s, 16)
				if (num <= 0xffff) {
					return String.fromCharCode(num)
				}
				return decodeUTF16(num)
			})
			.replace(/&#(\d*);/g, function (match, num) {
				if (num <= 0xffff) {
					return String.fromCharCode(num)
				}
				return decodeUTF16(num)
			})
	}
}
