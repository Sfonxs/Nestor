/**
 * 
 * @param type {string}
 * @param value {string}
 */
var Token = function (type, value) {
    /**
     * 
     * @type {string}
     */
    this.type = type;
    /**
     * 
     * @type {string}
     */
    this.value = value;
};
/**
 * 
 * @returns {string}
 */
Token.prototype.toString = function () {
    return "Token(" + String(this.type) + ", " + String(this.value) + ")";
};

module.exports = Token;