var TokenType = require('./tokentype.js');

var BinOpNode = function BinOpNode(left, op, right) {
    this.left = left;
    this.op = op;
    this.right = right;
};

var ProgramNode = function ProgramNode(childs) {
    this.childs = childs;
};

var StatementNode = function StatementNode(child) {
    this.child = child;
};

var DeclarationNode = function DeclarationNode(identifier) {
    this.identifier = identifier;
};

var AssignmentNode = function AssignmentNode(identifier, expression) {
    this.identifier = identifier;
    this.expression = expression;
};

var IdentifierNode = function IdentifierNode(text) {
    this.text = text;
};

var NumberNode = function NumberNode(nr) {
    this.nr = nr;
};

var MethodCallNode = function MethodCallNode(identifier, arguments) {
    this.identifier = identifier;
    this.arguments = arguments;
};

var ReturnNode = function ReturnNode(expression) {
    this.expression = expression;
};

var MethodNode = function MethodNode(identifier, args, body) {
    this.identifier = identifier;
    this.args = args;
    this.body = body;
};

var MethodBodyNode = function MethodBodyNode(childs){
    this.childs = childs;
};

var Parser = function (lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
};

Parser.prototype.eat = function (tokenType) {
    if (this.currentToken.type === tokenType) {
        this.currentToken = this.lexer.getNextToken();
    } else {
        throw "Parser error unexpected token " + String(this.currentToken) + " expected type " + String(tokenType);
    }
};

Parser.prototype.parse = function () {
    return this.program();
};

Parser.prototype.program = function () {
    // GRAMMER: program: statement (statement)*
    var childs = [];
    childs.push(this.statement());
    while (this.currentToken.type != TokenType.EOF) {
        childs.push(this.statement());
    }
    return new ProgramNode(childs);
};

Parser.prototype.statement = function () {
    // GRAMMER: statement: (declaration | assignment | method_call | return | method) statement_end
    var tt = this.currentToken.type;
    var child;
    if (tt === TokenType.DECLARATION) {
        child = this.declaration();
    } else if (tt === TokenType.ASSIGNMENT_BEGIN) {
        child = this.assignment();
    } else if (tt === TokenType.METHOD_CALL_BEGIN) {
        child = this.methodCall();
    } else if (tt === TokenType.ACTION_RETURN) {
        child = this.return();
    } else if (tt === TokenType.ACTION_CREATE_BEGIN) {
        child = this.method();
    } else {
        throw "Parser error in statement";
    }
    this.eat(TokenType.END_STATEMENT);
    return new StatementNode(child)
};

Parser.prototype.return = function () {
    // GRAMMER: return: action_return expression
    this.eat(TokenType.ACTION_RETURN);
    var expression = this.expression();
    return new ReturnNode(expression);
};

Parser.prototype.method = function () {
    // GRAMMER: method: action_create_begin identifier (action_arguments identifier (argument_seperator identifier)* | nothing) statement_end method_body method_end
    this.eat(TokenType.ACTION_CREATE_BEGIN);
    var methodIdentifier = this.identifier();
    var args = [];
    if (this.currentToken.type === TokenType.ACTION_ARGUMENTS) {
        this.eat(TokenType.ACTION_ARGUMENTS);
        args.push(this.identifier());
        while (this.currentToken.type === TokenType.ARGUMENT_SEPARATOR) {
            this.eat(TokenType.ARGUMENT_SEPARATOR);
            args.push(this.identifier());
        }
    }
    this.eat(TokenType.END_STATEMENT);
    var methodBody = this.methodBody();
    return new MethodNode(methodIdentifier, args, methodBody);
};

Parser.prototype.methodBody = function(){
    // GRAMMER: method_body: (statement)*
    var childs = [];
    while (this.currentToken.type != TokenType.ACTION_CREATE_END){
        childs.push(this.statement());
    }
    this.eat(TokenType.ACTION_CREATE_END);
    return new MethodBodyNode(childs);
};

Parser.prototype.declaration = function () {
    // GRAMMER: declaration: declaration_keyword identifier
    this.eat(TokenType.DECLARATION);
    var declaredText = this.currentToken.value;
    this.eat(TokenType.IDENTIFIEFER);
    return new DeclarationNode(new IdentifierNode(declaredText));
};

Parser.prototype.identifier = function () {
    var text = this.currentToken.value;
    this.eat(TokenType.IDENTIFIEFER);
    return new IdentifierNode(text);
};

Parser.prototype.number = function () {
    var nr = this.currentToken.value;
    this.eat(TokenType.NUMBER);
    return new NumberNode(nr);
};

Parser.prototype.assignment = function () {
    // GRAMMER: assignment: assignment_begin_keyword identifier assignment_end_keyword expression
    this.eat(TokenType.ASSIGNMENT_BEGIN);
    var identifier = this.identifier();
    this.eat(TokenType.ASSIGNMENT_AND_METHOD_CALL_END);
    return new AssignmentNode(identifier, this.expression());
};

Parser.prototype.expression = function () {
    // GRAMMER: expression: term ((PLUS | MIN) term)*
    var term = this.term();
    while ([TokenType.PLUS, TokenType.MINUS].indexOf(this.currentToken.type) != -1) {
        var tt = this.currentToken.type;
        var op;
        if (tt === TokenType.PLUS) {
            op = '+';
            this.eat(TokenType.PLUS);
        } else if (tt === TokenType.MINUS) {
            op = '-';
            this.eat(TokenType.MINUS);
        }
        term = new BinOpNode(term, op, this.term());
    }
    return term;
};

Parser.prototype.term = function () {
    // GRAMMER: term: value ((DIV | MULT) value)*
    var value = this.value();
    while ([TokenType.DIVIDE, TokenType.MULTIPLY].indexOf(this.currentToken.type) != -1) {
        var tt = this.currentToken.type;
        var op;
        if (tt === TokenType.DIVIDE) {
            op = '/';
            this.eat(TokenType.DIVIDE);
        } else if (tt === TokenType.MULTIPLY) {
            op = '*';
            this.eat(TokenType.MULTIPLY);
        }
        value = new BinOpNode(value, op, this.value());
    }
    return value;
};

Parser.prototype.value = function () {
    // GRAMMER: value: identifier | number | OPEN_PAR expression CLOSE_PAR | method_call
    var tt = this.currentToken.type;
    if (tt === TokenType.IDENTIFIEFER) {
        return this.identifier();
    } else if (tt === TokenType.NUMBER) {
        return this.number();
    } else if (tt === TokenType.OPEN_PAR) {
        this.eat(TokenType.OPEN_PAR);
        var expr = this.expression();
        this.eat(TokenType.CLOSE_PAR);
        return expr;
    } else if (tt === TokenType.METHOD_CALL_BEGIN) {
        return this.methodCall();
    } else {
        throw "Parser error while parsing value.";
    }
};

Parser.prototype.methodCall = function () {
    // GRAMMER: method_call: method_call_begin identifier (method_call_end expression (argument_seperator expression)* arguments_end| nothing)
    this.eat(TokenType.METHOD_CALL_BEGIN);
    var identifier = this.identifier();
    var arguments = [];
    if (this.currentToken.type === TokenType.ASSIGNMENT_AND_METHOD_CALL_END) {
        this.eat(TokenType.ASSIGNMENT_AND_METHOD_CALL_END);
        arguments.push(this.expression());
        while (this.currentToken.type === TokenType.ARGUMENT_SEPARATOR) {
            this.eat(TokenType.ARGUMENT_SEPARATOR);
            arguments.push(this.expression());
        }
        this.eat(TokenType.ARGUMENTS_END);
    }
    return new MethodCallNode(identifier, arguments);
};

module.exports = Parser;