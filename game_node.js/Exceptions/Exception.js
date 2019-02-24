"use strict";
exports.__esModule = true;
var Exception = /** @class */ (function () {
    function Exception(message, messageIHM) {
        this.message = new Error(message).stack;
        this.messageIHM = messageIHM;
    }
    return Exception;
}());
exports.Exception = Exception;
