"use strict";
exports.__esModule = true;
/// <reference path="/usr/lib/nodejs/typescript/lib/lib.es6.d.ts" />
var Listener_1 = require("./Listener");
var CardEventListener = /** @class */ (function () {
    function CardEventListener(context) {
        this.map = new Map();
        for (var methodName in context) {
            if (typeof context[methodName] === 'function' && !this.map.has(methodName)) {
                this.map.set(methodName, new Listener_1.Listener());
            }
        }
    }
    return CardEventListener;
}());
exports.CardEventListener = CardEventListener;
