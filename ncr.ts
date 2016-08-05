/**
 * 字元值參照 (Numeric Character Reference, NCR) 轉換
 */
namespace NCR {
	const leadAdd = 0xD800, trailAdd = 0xDC00, ncrSubtract = 0x10000

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
	 * 將字串 str 特殊字元編譯成字元值參照
	 * @param str 待轉換的 String
	 * @param hexadecimal 是否輸出成 16 進制的 NCR
	 * @example 	
	 * // return "&amp;#20320;&amp;#22909;"
	 * NCR.encode("你好")
	 * @example 	
	 * // return "&amp;#126976;"
	 * NCR.encode("\uD83C\uDC00")
	 * @example 	
	 * // return "&amp;#x10000;"
	 * NCR.encode("\uD83C\uDC00", true)
	 */
	export function encode(str: string, hexadecimal: boolean = false): string{
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
	/**
	 * 將字元值參照或是 HTML Entity 轉為原本字元
	 * @example 	
	 * // decode NCR
	 * // return "你好"
	 * NCR.decode("&amp;#20320;&amp;#22909;")
	 * @example 	
	 * // decode HTML Entity
	 * // return " "
	 * NCR.decode("&amp;nbsp;")
	 */
	export function decode(str: string): string{
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
			.replace(/&\w+;/g, function(match) {
				return HTMLSymbols[match] || match
			})
	}
}