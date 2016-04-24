var TokenType = require("./tokentype.js");

var TokenTypeLocator = function () {
    this.types = [];
    this.addTokenType(TokenType.PLUS, "added to");
    this.addTokenType(TokenType.MINUS, "subtracted by");
    this.addTokenType(TokenType.MULTIPLY, "multiplied by");
    this.addTokenType(TokenType.DIVIDE, "divided by");
    this.addTokenType(TokenType.DECLARATION, "Create container");
    this.addTokenType(TokenType.ASSIGNMENT_BEGIN, "Fill");
    this.addTokenType(TokenType.ASSIGNMENT_AND_METHOD_CALL_END, "with");
    this.addTokenType(TokenType.OPEN_PAR, "first");
    this.addTokenType(TokenType.CLOSE_PAR, "then");
    this.addTokenType(TokenType.METHOD_CALL_BEGIN, "Do action");
    this.addTokenType(TokenType.ARGUMENT_SEPARATOR, "and");
    this.addTokenType(TokenType.ARGUMENTS_END, "as items");
    this.addTokenType(TokenType.ACTION_CREATE_END, "End action creation");
    this.addTokenType(TokenType.ACTION_CREATE_BEGIN, "Start action creation of");
    this.addTokenType(TokenType.ACTION_ARGUMENTS, "with needed items");
    this.addTokenType(TokenType.ACTION_RETURN, "End action with");
};

TokenTypeLocator.prototype.addTokenType = function (type, text) {
    this.types.push({type: type, text: text});
};

TokenTypeLocator.prototype.shrink = function (text) {
    var i = this.types.length;
    while (i--) {
        var typeText = this.types[i].text;
        if (typeText.search(text) === -1) {
            this.types.splice(i, 1);
        }
    }
    return this.types.length;
};

TokenTypeLocator.prototype.hasOneExactMatch = function (text) {
    return this.types.length === 1 && this.types[0].text === text;
};

TokenTypeLocator.prototype.getExactMatchTokenType = function () {
    return this.types[0].type;
};

TokenTypeLocator.prototype.getExactMatchTokenTypeByString = function (text) {
  for(var i = 0; i < this.types.length; i++) {
      if (this.types[i].text === text) {
          return this.types[i].type;
      }
  }
};

module.exports = TokenTypeLocator;