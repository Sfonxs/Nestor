var utils = {
    isDigit: function (character) {
        return typeof(character) === "string" && character.search(/^[0-9]$/) != -1;
    },
    isNewLine: function (character) {
        return typeof(character) === "string" && character.search(/^\n$/) != -1;
    }
};

module.exports = utils;