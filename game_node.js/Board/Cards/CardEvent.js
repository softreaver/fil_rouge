"use strict";
exports.__esModule = true;
var CardEvent = /** @class */ (function () {
    function CardEvent(duration, effect) {
        this.turnsLeft = duration;
        this.effect = effect;
        this.target = null;
    }
    CardEvent.prototype.decreaseTimer = function (amount) {
        if (amount === void 0) { amount = 1; }
        if (this.turnsLeft > 0 && amount > 0) {
            this.turnsLeft -= amount;
            if (this.turnsLeft < 0) {
                this.turnsLeft = 0;
            }
        }
    };
    CardEvent.prototype.increaseTimer = function (amount) {
        if (amount === void 0) { amount = 1; }
        if (amount > 0) {
            this.turnsLeft += amount;
        }
    };
    CardEvent.prototype.getTimer = function () {
        return this.turnsLeft;
    };
    CardEvent.prototype.getTarget = function () {
        return this.target;
    };
    CardEvent.prototype.setTarget = function (target) {
        this.target = target;
    };
    return CardEvent;
}());
exports.CardEvent = CardEvent;
