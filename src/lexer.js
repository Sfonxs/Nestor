var Token = require('./token.js');
var TokenType = require('./tokentype.js');
var TokenTypeLocator = require('./tokentypelocator');
var utils = require('./utils.js');

var Lexer = function(text) {
    this.text = text.replace(/(?:\r\n|\r|\n)/g, '\n');
    this.pos = 0;
    this.currentChar = this.text[this.pos];
};

Lexer.prototype.advance = function () {
    if (this.text.length <= this.pos) {
        this.currentChar = null;
    }
    this.currentChar = this.text[++this.pos];
};

Lexer.prototype.retreat = function(){
    this.pos--;
    if (this.text.length <= this.pos) {
        this.currentChar = null;
    }
    this.currentChar = this.text[this.pos];
};

Lexer.prototype.getNextToken = function () {
    while (this.currentChar != null) {

        if (utils.isNewLine(this.currentChar)) {
            this.advance();
            continue;
        }
        if (this.currentChar === ' ') {
            this.advance();
            continue;
        }

        if (this.currentChar === '.') {
            this.advance();
            if (this.currentChar == null || utils.isNewLine(this.currentChar)) {
                this.advance();
                return new Token(TokenType.END_STATEMENT, '.');
            } else {
                throw "Syntax error expected newline after . instead of " + String(this.currentChar);
            }
        }

        if (utils.isDigit(this.currentChar)) {
            return new Token(TokenType.NUMBER, this.number());
        }

        var stringToken = this.stringToken();
        if (stringToken) {
            return stringToken;
        }

        throw "Syntax error at position " + String(this.pos) + " at character " + String(this.currentChar);
    }
    return new Token(TokenType.EOF, null);
};

Lexer.prototype.stringToken = function () {
    var ttl = new TokenTypeLocator();
    var curText = this.currentChar;
    var matches = ttl.shrink(curText);
    var charsAfterTokens = [null, ' ', '.', '\n'];
    while (matches != 0) {
        if (ttl.hasOneExactMatch(curText)) {
            this.advance();
            if (charsAfterTokens.indexOf(this.currentChar) != -1) {
                return new Token(ttl.getExactMatchTokenType(), curText);
            } else {
                throw "Syntax error unexpected character " + String(this.currentChar)
                + " after " + String(curText) + " at " + String(this.pos);
            }
        } else {
            this.advance();
            if (this.currentChar === null) {
                break;
            }
            curText += this.currentChar;
        }
        matches = ttl.shrink(curText);
    }
    if (curText.search(/\s/) != -1) {
        var lastSpace = curText.lastIndexOf(' ');
        if (lastSpace != -1){
            var shorterMatch = curText.substring(0, lastSpace);
            var ttl2 = new TokenTypeLocator();
            var secondMatch = ttl2.getExactMatchTokenTypeByString(shorterMatch);
            if (secondMatch){
                for (var i = 1; i < curText.length - lastSpace; i++){
                    this.retreat();
                }
                if (charsAfterTokens.indexOf(this.currentChar) != -1) {
                    return new Token(secondMatch, shorterMatch);
                } else {
                    throw "Syntax error unexpected character " + String(this.currentChar)
                    + " after " + String(curText) + " at " + String(this.pos);
                }
            }
        }
        throw "Syntax error unexpected word " + String(curText) + " at " + String(this.pos);
    }
    this.advance();
    while (this.currentChar != null && this.currentChar.search(/^[a-zA-Z0-9]$/) == 0) {
        curText += this.currentChar;
        this.advance();
    }
    return new Token(TokenType.IDENTIFIEFER, curText);
};

Lexer.prototype.number = function () {
    var theNumber = '';
    var hadComma = false;
    while (this.currentChar != null && (utils.isDigit(this.currentChar) || (this.currentChar === '.' && !hadComma))) {
        if (this.currentChar === '.') {
            hadComma = true;
        }
        theNumber += this.currentChar;
        this.advance();
    }
    if (theNumber.charAt(theNumber.length - 1) === '.'){
        this.retreat();
        theNumber = theNumber.replace('.', '');
        return theNumber;
    }else {
        return theNumber;
    }
};

module.exports = Lexer;