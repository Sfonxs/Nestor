var NativeMethodHandler = require('./nativemethodhandler');

var Interpreter = function (parser) {
    this.ast = parser.parse();
    this.containers = {};
    this.methods = {};
    this.localScopeItems = null;
    this.scopeStack = [];
    this.nmh = new NativeMethodHandler();
};

Interpreter.prototype.interpret = function () {
    this.visit(this.ast);
};

Interpreter.prototype.visit = function (node) {
    var className = node.constructor.name;
    var methodName = "visit_" + className;
    if (typeof this[methodName] === 'function') {
        return this[methodName](node);
    } else {
        throw "Interpreter error did not find way to visit node of type " + String(className);
    }
};

Interpreter.prototype.visit_BinOpNode = function (node) {
    var left = this.visit(node.left);
    var right = this.visit(node.right);
    if (node.op === '+') {
        return left + right;
    } else if (node.op === '-') {
        return left - right;
    } else if (node.op === '/') {
        return left / right;
    } else if (node.op === '*') {
        return left * right;
    } else {
        throw "Interpreter error did not recognize " + String(node.op);
    }
};
Interpreter.prototype.visit_ProgramNode = function (node) {
    for (var i = 0; i < node.childs.length; i++) {
        this.visit(node.childs[i]);
    }
};
Interpreter.prototype.visit_StatementNode = function (node) {
    return this.visit(node.child);
};
Interpreter.prototype.visit_DeclarationNode = function (node) {
    var text = node.identifier.text;
    var scope = this.localScopeItems != null ? this.localScopeItems : this.containers;
    if (typeof scope[text] !== 'undefined') {
        throw "Interpreter error container " + String(text) + " already created.";
    } else {
        scope[text] = null;
    }
};
Interpreter.prototype.visit_AssignmentNode = function (node) {
    var text = node.identifier.text;
    if (this.localScopeItems != null && typeof this.localScopeItems[text] !== 'undefined'){
        this.localScopeItems[text] = this.visit(node.expression);
    }else {
        if (typeof this.containers[text] === 'undefined') {
            throw "Interpreter error container " + String(text) + " doesn't exist.";
        }
        this.containers[text] = this.visit(node.expression);
    }
};
Interpreter.prototype.visit_IdentifierNode = function (node) {
    if (this.localScopeItems != null && typeof this.localScopeItems[node.text] !== 'undefined'){
        return this.localScopeItems[node.text];
    }else {
        if (typeof this.containers[node.text] === 'undefined') {
            throw "Interpreter error container " + String(node.text) + " doesn't exist.";
        }
        return this.containers[node.text];
    }
};
Interpreter.prototype.visit_NumberNode = function (node) {
    return parseFloat(node.nr);
};
Interpreter.prototype.visit_MethodCallNode = function (node) {
    var args = [];
    for (var i = 0; i < node.arguments.length; i++) {
        args.push(this.visit(node.arguments[i]));
    }
    var methodName = node.identifier.text;
    var method = this.methods[methodName];
    if (typeof method !== 'undefined'){
        var methodArgNames = method.args;
        if (this.localScopeItems != null){
            this.scopeStack.push(this.localScopeItems);
        }
        this.localScopeItems = {};
        // unchecked parameter count
        for (var i = 0; i < methodArgNames.length; i++){
            this.localScopeItems[methodArgNames[i].text] = args[i];
        }
        return this.visit(method.body);
    }else if (this.nmh.isNativeMethod(node.identifier.text)) {
        return this.nmh.executeNativeMethod(node.identifier.text, args);
    }
    throw "Interpreter error action name "+String(methodName)+" doesn't exist.";
};
Interpreter.prototype.visit_MethodNode = function (node) {
    var methodText = node.identifier.text;
    if (typeof this.methods[methodText] !== 'undefined') {
        throw "Interpreter error action name " + String(methodText) + " already exists.";
    }
    this.methods[methodText] = {args: node.args, body: node.body};
};

Interpreter.prototype.visit_MethodBodyNode = function(node){
    for (var i = 0; i < node.childs.length; i++) {
        var returned = this.visit(node.childs[i]);
        if (typeof returned !== 'undefined'){
            this.localScopeItems = this.scopeStack.length >= 1 ? this.scopeStack.pop() : null;
            return returned;
        }
    }
};

Interpreter.prototype.visit_ReturnNode = function(node){
    return this.visit(node.expression);
};

module.exports = Interpreter;