/**
 * Numeric Character Reference js
 * 
 * https://github.com/shiyou0130011/Numeric-Character-Reference-js
 * @version 1.1
 * @license Apache-2.0
 */

/**
 * 字元值參照 (Numeric Character Reference, NCR) 轉換
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
			.replace(/&\w+;/g, function(match) {
				return HTMLSymbols[match] || match
			})
	}
}

var HTMLSymbols = {
	// HTML 4 Entity
	"&amp;":	"\u0026", 
	"\u0026":	"&amp;", 
	"&lt;":		"\u003c", 
	"\u003c":	"&lt;", 
	"&gt;":		"\u003e", 
	"\u003e":	"&gt;", 
	"&nbsp;":	"\u00a0", 
	"\u00a0":	"&nbsp;", 
	"&iexcl;":	"\u00a1", 
	"\u00a1":	"&iexcl;", 
	"&cent;":	"\u00a2", 
	"\u00a2":	"&cent;", 
	"&pound;":	"\u00a3", 
	"\u00a3":	"&pound;", 
	"&curren;":	"\u00a4", 
	"\u00a4":	"&curren;", 
	"&yen;":	"\u00a5", 
	"\u00a5":	"&yen;", 
	"&brvbar;":	"\u00a6", 
	"\u00a6":	"&brvbar;", 
	"&sect;":	"\u00a7", 
	"\u00a7":	"&sect;", 
	"&uml;":	"\u00a8", 
	"\u00a8":	"&uml;", 
	"&copy;":	"\u00a9", 
	"\u00a9":	"&copy;", 
	"&ordf;":	"\u00aa", 
	"\u00aa":	"&ordf;", 
	"&laquo;":	"\u00ab", 
	"\u00ab":	"&laquo;", 
	"&not;":	"\u00ac", 
	"\u00ac":	"&not;", 
	"&shy;":	"\u00ad", 
	"\u00ad":	"&shy;", 
	"&reg;":	"\u00ae", 
	"\u00ae":	"&reg;", 
	"&macr;":	"\u00af", 
	"\u00af":	"&macr;", 
	"&deg;":	"\u00b0", 
	"\u00b0":	"&deg;", 
	"&plusmn;":	"\u00b1", 
	"\u00b1":	"&plusmn;", 
	"&sup2;":	"\u00b2", 
	"\u00b2":	"&sup2;", 
	"&sup3;":	"\u00b3", 
	"\u00b3":	"&sup3;", 
	"&acute;":	"\u00b4", 
	"\u00b4":	"&acute;", 
	"&micro;":	"\u00b5", 
	"\u00b5":	"&micro;", 
	"&para;":	"\u00b6", 
	"\u00b6":	"&para;", 
	"&middot;":	"\u00b7", 
	"\u00b7":	"&middot;", 
	"&cedil;":	"\u00b8", 
	"\u00b8":	"&cedil;", 
	"&sup1;":	"\u00b9", 
	"\u00b9":	"&sup1;", 
	"&ordm;":	"\u00ba", 
	"\u00ba":	"&ordm;", 
	"&raquo;":	"\u00bb", 
	"\u00bb":	"&raquo;", 
	"&frac14;":	"\u00bc", 
	"\u00bc":	"&frac14;", 
	"&frac12;":	"\u00bd", 
	"\u00bd":	"&frac12;", 
	"&frac34;":	"\u00be", 
	"\u00be":	"&frac34;", 
	"&iquest;":	"\u00bf", 
	"\u00bf":	"&iquest;", 
	"&Agrave;":	"\u00c0", 
	"\u00c0":	"&Agrave;", 
	"&Aacute;":	"\u00c1", 
	"\u00c1":	"&Aacute;", 
	"&Acirc;":	"\u00c2", 
	"\u00c2":	"&Acirc;", 
	"&Atilde;":	"\u00c3", 
	"\u00c3":	"&Atilde;", 
	"&Auml;":	"\u00c4", 
	"\u00c4":	"&Auml;", 
	"&Aring;":	"\u00c5", 
	"\u00c5":	"&Aring;", 
	"&AElig;":	"\u00c6", 
	"\u00c6":	"&AElig;", 
	"&Ccedil;":	"\u00c7", 
	"\u00c7":	"&Ccedil;", 
	"&Egrave;":	"\u00c8", 
	"\u00c8":	"&Egrave;", 
	"&Eacute;":	"\u00c9", 
	"\u00c9":	"&Eacute;", 
	"&Ecirc;":	"\u00ca", 
	"\u00ca":	"&Ecirc;", 
	"&Euml;":	"\u00cb", 
	"\u00cb":	"&Euml;", 
	"&Igrave;":	"\u00cc", 
	"\u00cc":	"&Igrave;", 
	"&Iacute;":	"\u00cd", 
	"\u00cd":	"&Iacute;", 
	"&Icirc;":	"\u00ce", 
	"\u00ce":	"&Icirc;", 
	"&Iuml;":	"\u00cf", 
	"\u00cf":	"&Iuml;", 
	"&ETH;":	"\u00d0", 
	"\u00d0":	"&ETH;", 
	"&Ntilde;":	"\u00d1", 
	"\u00d1":	"&Ntilde;", 
	"&Ograve;":	"\u00d2", 
	"\u00d2":	"&Ograve;", 
	"&Oacute;":	"\u00d3", 
	"\u00d3":	"&Oacute;", 
	"&Ocirc;":	"\u00d4", 
	"\u00d4":	"&Ocirc;", 
	"&Otilde;":	"\u00d5", 
	"\u00d5":	"&Otilde;", 
	"&Ouml;":	"\u00d6", 
	"\u00d6":	"&Ouml;", 
	"&times;":	"\u00d7", 
	"\u00d7":	"&times;", 
	"&Oslash;":	"\u00d8", 
	"\u00d8":	"&Oslash;", 
	"&Ugrave;":	"\u00d9", 
	"\u00d9":	"&Ugrave;", 
	"&Uacute;":	"\u00da", 
	"\u00da":	"&Uacute;", 
	"&Ucirc;":	"\u00db", 
	"\u00db":	"&Ucirc;", 
	"&Uuml;":	"\u00dc", 
	"\u00dc":	"&Uuml;", 
	"&Yacute;":	"\u00dd", 
	"\u00dd":	"&Yacute;", 
	"&THORN;":	"\u00de", 
	"\u00de":	"&THORN;", 
	"&szlig;":	"\u00df", 
	"\u00df":	"&szlig;", 
	"&agrave;":	"\u00e0", 
	"\u00e0":	"&agrave;", 
	"&aacute;":	"\u00e1", 
	"\u00e1":	"&aacute;", 
	"&acirc;":	"\u00e2", 
	"\u00e2":	"&acirc;", 
	"&atilde;":	"\u00e3", 
	"\u00e3":	"&atilde;", 
	"&auml;":	"\u00e4", 
	"\u00e4":	"&auml;", 
	"&aring;":	"\u00e5", 
	"\u00e5":	"&aring;", 
	"&aelig;":	"\u00e6", 
	"\u00e6":	"&aelig;", 
	"&ccedil;":	"\u00e7", 
	"\u00e7":	"&ccedil;", 
	"&egrave;":	"\u00e8", 
	"\u00e8":	"&egrave;", 
	"&eacute;":	"\u00e9", 
	"\u00e9":	"&eacute;", 
	"&ecirc;":	"\u00ea", 
	"\u00ea":	"&ecirc;", 
	"&euml;":	"\u00eb", 
	"\u00eb":	"&euml;", 
	"&igrave;":	"\u00ec", 
	"\u00ec":	"&igrave;", 
	"&iacute;":	"\u00ed", 
	"\u00ed":	"&iacute;", 
	"&icirc;":	"\u00ee", 
	"\u00ee":	"&icirc;", 
	"&iuml;":	"\u00ef", 
	"\u00ef":	"&iuml;", 
	"&eth;":	"\u00f0", 
	"\u00f0":	"&eth;", 
	"&ntilde;":	"\u00f1", 
	"\u00f1":	"&ntilde;", 
	"&ograve;":	"\u00f2", 
	"\u00f2":	"&ograve;", 
	"&oacute;":	"\u00f3", 
	"\u00f3":	"&oacute;", 
	"&ocirc;":	"\u00f4", 
	"\u00f4":	"&ocirc;", 
	"&otilde;":	"\u00f5", 
	"\u00f5":	"&otilde;", 
	"&ouml;":	"\u00f6", 
	"\u00f6":	"&ouml;", 
	"&divide;":	"\u00f7", 
	"\u00f7":	"&divide;", 
	"&oslash;":	"\u00f8", 
	"\u00f8":	"&oslash;", 
	"&ugrave;":	"\u00f9", 
	"\u00f9":	"&ugrave;", 
	"&uacute;":	"\u00fa", 
	"\u00fa":	"&uacute;", 
	"&ucirc;":	"\u00fb", 
	"\u00fb":	"&ucirc;", 
	"&uuml;":	"\u00fc", 
	"\u00fc":	"&uuml;", 
	"&yacute;":	"\u00fd", 
	"\u00fd":	"&yacute;", 
	"&thorn;":	"\u00fe", 
	"\u00fe":	"&thorn;", 
	"&yuml;":	"\u00ff", 
	"\u00ff":	"&yuml;", 
	"&fnof;":	"\u0192", 
	"\u0192":	"&fnof;", 
	"&Alpha;":	"\u0391", 
	"\u0391":	"&Alpha;", 
	"&Beta;":	"\u0392", 
	"\u0392":	"&Beta;", 
	"&Gamma;":	"\u0393", 
	"\u0393":	"&Gamma;", 
	"&Delta;":	"\u0394", 
	"\u0394":	"&Delta;", 
	"&Epsilon;":	"\u0395", 
	"\u0395":	"&Epsilon;", 
	"&Zeta;":	"\u0396", 
	"\u0396":	"&Zeta;", 
	"&Eta;":	"\u0397", 
	"\u0397":	"&Eta;", 
	"&Theta;":	"\u0398", 
	"\u0398":	"&Theta;", 
	"&Iota;":	"\u0399", 
	"\u0399":	"&Iota;", 
	"&Kappa;":	"\u039a", 
	"\u039a":	"&Kappa;", 
	"&Lambda;":	"\u039b", 
	"\u039b":	"&Lambda;", 
	"&Mu;":		"\u039c", 
	"\u039c":	"&Mu;", 
	"&Nu;":		"\u039d", 
	"\u039d":	"&Nu;", 
	"&Xi;":		"\u039e", 
	"\u039e":	"&Xi;", 
	"&Omicron;":	"\u039f", 
	"\u039f":	"&Omicron;", 
	"&Pi;":		"\u03a0", 
	"\u03a0":	"&Pi;", 
	"&Rho;":	"\u03a1", 
	"\u03a1":	"&Rho;", 
	"&Sigma;":	"\u03a3", 
	"\u03a3":	"&Sigma;", 
	"&Tau;":	"\u03a4", 
	"\u03a4":	"&Tau;", 
	"&Upsilon;":	"\u03a5", 
	"\u03a5":	"&Upsilon;", 
	"&Phi;":	"\u03a6", 
	"\u03a6":	"&Phi;", 
	"&Chi;":	"\u03a7", 
	"\u03a7":	"&Chi;", 
	"&Psi;":	"\u03a8", 
	"\u03a8":	"&Psi;", 
	"&Omega;":	"\u03a9", 
	"\u03a9":	"&Omega;", 
	"&alpha;":	"\u03b1", 
	"\u03b1":	"&alpha;", 
	"&beta;":	"\u03b2", 
	"\u03b2":	"&beta;", 
	"&gamma;":	"\u03b3", 
	"\u03b3":	"&gamma;", 
	"&delta;":	"\u03b4", 
	"\u03b4":	"&delta;", 
	"&epsilon;":	"\u03b5", 
	"\u03b5":	"&epsilon;", 
	"&zeta;":	"\u03b6", 
	"\u03b6":	"&zeta;", 
	"&eta;":	"\u03b7", 
	"\u03b7":	"&eta;", 
	"&theta;":	"\u03b8", 
	"\u03b8":	"&theta;", 
	"&iota;":	"\u03b9", 
	"\u03b9":	"&iota;", 
	"&kappa;":	"\u03ba", 
	"\u03ba":	"&kappa;", 
	"&lambda;":	"\u03bb", 
	"\u03bb":	"&lambda;", 
	"&mu;":		"\u03bc", 
	"\u03bc":	"&mu;", 
	"&nu;":		"\u03bd", 
	"\u03bd":	"&nu;", 
	"&xi;":		"\u03be", 
	"\u03be":	"&xi;", 
	"&omicron;":	"\u03bf", 
	"\u03bf":	"&omicron;", 
	"&pi;":		"\u03c0", 
	"\u03c0":	"&pi;", 
	"&rho;":	"\u03c1", 
	"\u03c1":	"&rho;", 
	"&sigmaf;":	"\u03c2", 
	"\u03c2":	"&sigmaf;", 
	"&sigma;":	"\u03c3", 
	"\u03c3":	"&sigma;", 
	"&tau;":	"\u03c4", 
	"\u03c4":	"&tau;", 
	"&upsilon;":	"\u03c5", 
	"\u03c5":	"&upsilon;", 
	"&phi;":	"\u03c6", 
	"\u03c6":	"&phi;", 
	"&chi;":	"\u03c7", 
	"\u03c7":	"&chi;", 
	"&psi;":	"\u03c8", 
	"\u03c8":	"&psi;", 
	"&omega;":	"\u03c9", 
	"\u03c9":	"&omega;", 
	"&thetasym;":	"\u03d1", 
	"\u03d1":	"&thetasym;", 
	"&upsih;":	"\u03d2", 
	"\u03d2":	"&upsih;", 
	"&piv;":	"\u03d6", 
	"\u03d6":	"&piv;", 
	
	// Special Symbols
	"&bull;":	"\u2022", 
	"\u2022":	"&bull;", 
	"&hellip;":	"\u2026", 
	"\u2026":	"&hellip;", 
	"&prime;":	"\u2032", 
	"\u2032":	"&prime;", 
	"&Prime;":	"\u2033", 
	"\u2033":	"&Prime;", 
	"&oline;":	"\u203e", 
	"\u203e":	"&oline;", 
	"&frasl;":	"\u2044", 
	"\u2044":	"&frasl;", 
	"&weierp;":	"\u2118", 
	"\u2118":	"&weierp;", 
	
	// UTF-8 Letterlike Symbols
	"&image;":	"\u2111", 
	"\u2111":	"&image;", 
	"&real;":	"\u211c", 
	"\u211c":	"&real;", 
	"&trade;":	"\u2122", 
	"\u2122":	"&trade;", 
	"&alefsym;":	"\u2135", 
	"\u2135":	"&alefsym;", 
	"&larr;":	"\u2190", 
	
	// UTF-8 Arrows
	"\u2190":	"&larr;", 
	"&uarr;":	"\u2191", 
	"\u2191":	"&uarr;", 
	"&rarr;":	"\u2192", 
	"\u2192":	"&rarr;", 
	"&darr;":	"\u2193", 
	"\u2193":	"&darr;", 
	"&harr;":	"\u2194", 
	"\u2194":	"&harr;", 
	"&crarr;":	"\u21b5", 
	"\u21b5":	"&crarr;", 
	"&lArr;":	"\u21d0", 
	"\u21d0":	"&lArr;", 
	"&uArr;":	"\u21d1", 
	"\u21d1":	"&uArr;", 
	"&rArr;":	"\u21d2", 
	"\u21d2":	"&rArr;", 
	"&dArr;":	"\u21d3", 
	"\u21d3":	"&dArr;", 
	"&hArr;":	"\u21d4", 
	"\u21d4":	"&hArr;", 
	
	// UTF-8 Mathematical Operators
	"&forall;":	"\u2200", 
	"\u2200":	"&forall;", 
	"&part;":	"\u2202", 
	"\u2202":	"&part;", 
	"&exist;":	"\u2203", 
	"\u2203":	"&exist;", 
	"&empty;":	"\u2205", 
	"\u2205":	"&empty;", 
	"&nabla;":	"\u2207", 
	"\u2207":	"&nabla;", 
	"&isin;":	"\u2208", 
	"\u2208":	"&isin;", 
	"&notin;":	"\u2209", 
	"\u2209":	"&notin;", 
	"&ni;":		"\u220b", 
	"\u220b":	"&ni;", 
	"&prod;":	"\u220f", 
	"\u220f":	"&prod;", 
	"&sum;":	"\u2211", 
	"\u2211":	"&sum;", 
	"&minus;":	"\u2212", 
	"\u2212":	"&minus;", 
	"&lowast;":	"\u2217", 
	"\u2217":	"&lowast;", 
	"&radic;":	"\u221a", 
	"\u221a":	"&radic;", 
	"&prop;":	"\u221d", 
	"\u221d":	"&prop;", 
	"&infin;":	"\u221e", 
	"\u221e":	"&infin;", 
	"&ang;":	"\u2220", 
	"\u2220":	"&ang;", 
	"&and;":	"\u2227", 
	"\u2227":	"&and;", 
	"&or;":		"\u2228", 
	"\u2228":	"&or;", 
	"&cap;":	"\u2229", 
	"\u2229":	"&cap;", 
	"&cup;":	"\u222a", 
	"\u222a":	"&cup;", 
	"&int;":	"\u222b", 
	"\u222b":	"&int;", 
	"&there4;":	"\u2234", 
	"\u2234":	"&there4;", 
	"&sim;":	"\u223c", 
	"\u223c":	"&sim;", 
	"&cong;":	"\u2245", 
	"\u2245":	"&cong;", 
	"&asymp;":	"\u2248", 
	"\u2248":	"&asymp;", 
	"&ne;":		"\u2260", 
	"\u2260":	"&ne;", 
	"&equiv;":	"\u2261", 
	"\u2261":	"&equiv;", 
	"&le;":		"\u2264", 
	"\u2264":	"&le;", 
	"&ge;":		"\u2265", 
	"\u2265":	"&ge;", 
	"&sub;":	"\u2282", 
	"\u2282":	"&sub;", 
	"&sup;":	"\u2283", 
	"\u2283":	"&sup;", 
	"&nsub;":	"\u2284", 
	"\u2284":	"&nsub;", 
	"&sube;":	"\u2286", 
	"\u2286":	"&sube;", 
	"&supe;":	"\u2287", 
	"\u2287":	"&supe;", 
	"&oplus;":	"\u2295", 
	"\u2295":	"&oplus;", 
	"&otimes;":	"\u2297", 
	"\u2297":	"&otimes;", 
	"&perp;":	"\u22a5", 
	"\u22a5":	"&perp;", 
	"&sdot;":	"\u22c5", 
	"\u22c5":	"&sdot;", 
	"&lceil;":	"\u2308", 
	"\u2308":	"&lceil;", 
	"&rceil;":	"\u2309", 
	"\u2309":	"&rceil;", 
	"&lfloor;":	"\u230a", 
	"\u230a":	"&lfloor;", 
	"&rfloor;":	"\u230b", 
	"\u230b":	"&rfloor;", 
	"&lang;":	"\u2329", 
	"\u2329":	"&lang;", 
	"&rang;":	"\u232a", 
	"\u232a":	"&rang;", 
	
	// UTF-8 Geometric Shapes
	"&loz;":	"\u25ca", 
	"\u25ca":	"&loz;", 
	
	// UTF-8 Miscellaneous Symbols
	"&spades;":	"\u2660", 
	"\u2660":	"&spades;", 
	"&clubs;":	"\u2663", 
	"\u2663":	"&clubs;", 
	"&hearts;":	"\u2665", 
	"\u2665":	"&hearts;", 
	"&diams;":	"\u2666", 
	"\u2666":	"&diams;", 
	
	// UTF-8 General Punctuation
	"&ensp;":	"\u8194", 
	"\u8194":	"&ensp;", 
	"&emsp;":	"\u8195", 
	"\u8195":	"&emsp;", 
	"&thinsp;":	"\u8201", 
	"\u8201":	"&thinsp;", 
	"&zwnj;":	"\u8204", 
	"\u8204":	"&zwnj;", 
	"&zwj;":	"\u8205", 
	"\u8205":	"&zwj;", 
	"&lrm;":	"\u8206", 
	"\u8206":	"&lrm;", 
	"&rlm;":	"\u8207", 
	"\u8207":	"&rlm;", 
	"&ndash;":	"\u8211", 
	"\u8211":	"&ndash;", 
	"&mdash;":	"\u8212", 
	"\u8212":	"&mdash;", 
	"&lsquo;":	"\u8216", 
	"\u8216":	"&lsquo;", 
	"&rsquo;":	"\u8217", 
	"\u8217":	"&rsquo;", 
	"&sbquo;":	"\u8218", 
	"\u8218":	"&sbquo;", 
	"&ldquo;":	"\u8220", 
	"\u8220":	"&ldquo;", 
	"&rdquo;":	"\u8221", 
	"\u8221":	"&rdquo;", 
	"&bdquo;":	"\u8222", 
	"\u8222":	"&bdquo;", 
	"&dagger;":	"\u8224", 
	"\u8224":	"&dagger;", 
	"&Dagger;":	"\u8225", 
	"\u8225":	"&Dagger;", 
	//"&bull;":	"\u8226", 
	"\u8226":	"&bull;", 
	//"&hellip;":	"\u8230", 
	"\u8230":	"&hellip;", 
	"&permil;":	"\u8240", 
	"\u8240":	"&permil;", 
	//"&prime;":	"\u8242", 
	"\u8242":	"&prime;", 
	//"&Prime;":	"\u8243", 
	"\u8243":	"&Prime;", 
	"&lsaquo;":	"\u8249", 
	"\u8249":	"&lsaquo;", 
	"&rsaquo;":	"\u8250", 
	"\u8250":	"&rsaquo;", 
	//"&oline;":	"\u8254", 
	"\u8254":	"&oline;", 
	//"&frasl;":	"\u8260", 
	"\u8260":	"&frasl;",
	
	// UTF-8 Currency Symbols
	"&euro;":	"\u20ac", 
	"\u20ac":	"&euro;"
}