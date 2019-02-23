"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Card = /** @class */ (function () {
    function Card(name, maxLife) {
        this.name = name;
        this.maxLife = maxLife;
        this.life = maxLife;
    }
    Card.prototype.decreaseLife = function (amount) {
        this.life -= amount;
        if (this.life < 0) {
            this.life = 0;
        }
    };
    Card.prototype.getLife = function () {
        return this.life;
    };
    return Card;
}());
exports.Card = Card;
var MagicCard = /** @class */ (function (_super) {
    __extends(MagicCard, _super);
    function MagicCard(name, maxLife) {
        return _super.call(this, name, maxLife) || this;
    }
    return MagicCard;
}(Card));
exports.MagicCard = MagicCard;
var ENUM;
(function (ENUM) {
    ENUM[ENUM["ONE"] = 1] = "ONE";
    ENUM[ENUM["TWO"] = 2] = "TWO";
})(ENUM = exports.ENUM || (exports.ENUM = {}));
