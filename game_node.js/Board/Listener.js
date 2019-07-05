"use strict";
exports.__esModule = true;
var Triger;
(function (Triger) {
    Triger[Triger["Prevent"] = 0] = "Prevent";
    Triger[Triger["Before"] = 1] = "Before";
    Triger[Triger["After"] = 2] = "After";
})(Triger || (Triger = {}));
var Listener = /** @class */ (function () {
    function Listener() {
        this.prevent = [];
        this.before = [];
        this.after = [];
    }
    Listener.prototype.addEvent = function (triger, effect) {
        switch (triger) {
            case Triger.Prevent:
                this.prevent.push(effect);
                break;
            case Triger.Before:
                this.before.push(effect);
                break;
            case Triger.After:
                this.after.push(effect);
                break;
            default:
        }
    };
    Listener.prototype.removeEvent = function (triger, effect) {
        var index;
        switch (triger) {
            case Triger.Prevent:
                index = this.prevent.indexOf(effect);
                if (index !== -1) {
                    this.prevent.splice(index, 1);
                }
                break;
            case Triger.Before:
                index = this.before.indexOf(effect);
                if (index !== -1) {
                    this.before.splice(index, 1);
                }
                break;
            case Triger.After:
                index = this.after.indexOf(effect);
                if (index !== -1) {
                    this.after.splice(index, 1);
                }
                break;
            default:
        }
    };
    Listener.Triger = Triger;
    return Listener;
}());
exports.Listener = Listener;
