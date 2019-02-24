"use strict";
exports.__esModule = true;
var CardEventListener = /** @class */ (function () {
    function CardEventListener(context) {
        for (var methodName in context) {
            console.log(methodName);
        }
    }
    return CardEventListener;
}());
exports.CardEventListener = CardEventListener;
