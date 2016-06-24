# Numeric Character Reference js  [![Apache 2.0 License](https://img.shields.io/badge/listence-apache%202.0-%23CB2533.svg)](http://www.apache.org/licenses/LICENSE-2.0)
This is a javascript ([typescript](https://www.typescriptlang.org/)) project used for conversion between “Numeric Character Reference” (HTML Entity) and the char.

## Example

### Parsing  English	
	NCR.encode("Hello World")	// will return ("Hello World")
	
	NCR.decode("Hello World")	// will return ("Hello World")

### Parsing Chinese
	NCR.encode("你好，世界")	// will return "&#20320;&#22909;&#65292;&#19990;&#30028;"
	
	NCR.decode("&#20320;&#22909;&#65292;&#19990;&#30028;")	// will return "你好，世界"

### String width Emoji
	NCR.encode("This is a penguin: \uD83D\uDC27")     	// will return "This is a penguin: &#128039;"
	NCR.encode("This is a penguin: \uD83D\uDC27", true)	// will return "This is a penguin: &#x1f427;"
	
	NCR.decode("This is a penguin: &#x1f427;")        	// Using HTML Entity (Hexadecimal). It will return "This is a penguin: \uD83D\uDC27"
	
	NCR.decode("This is a penguin: &#128039;")        	// Using HTML Entity (Decimal). It will return "This is a penguin: \uD83D\uDC27", too.
