var fs = require('fs');
var TokenType = require('./tokentype.js');
var Lexer = require('./lexer.js');
var Parser = require('./parser');
var Interpreter = require('./interpreter');

var main = {
    init: function () {

    },
    showLexerTokens: function (data) {
        var lexer = new Lexer(data);
        var token = lexer.getNextToken();
        while (token.type != TokenType.EOF) {
            console.log(token.toString());
            token = lexer.getNextToken();
        }
        console.log(token.toString());
    },
    doInterpet: function(data){
        // console.log(data);
        // main.showLexerTokens(data);
        var lexer = new Lexer(data);
        var parser = new Parser(lexer);
        var interpreter = new Interpreter(parser);
        interpreter.interpret();
    }
};

main.init();
main.doInterpet(fs.readFileSync("./test_nestor_code.nt", 'utf8'));
//main.startConsoleLineInterpreter();