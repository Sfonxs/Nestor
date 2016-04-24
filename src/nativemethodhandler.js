var NativeMethodHandler = function () {
    this.nativeMethods = {};
    this.nativeMethods.Show = function (args) {
        var text = '';
        for (var i = 0; i < args.length; i++) {
            text += String(args[i]);
        }
        console.log(text);
    }
};
NativeMethodHandler.prototype.isNativeMethod = function (text) {
    return typeof this.nativeMethods[text] !== 'undefined';
};

NativeMethodHandler.prototype.executeNativeMethod = function (text) {
    var args = [];
    for (var i = 1; i < arguments.length; i++){
        args.push(arguments[i]);
    }
    return this.nativeMethods[text](args);
};

module.exports = NativeMethodHandler;