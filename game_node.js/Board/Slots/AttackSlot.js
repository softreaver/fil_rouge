"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Slot_1 = require("./Slot");
var AttackSlot = /** @class */ (function (_super) {
    __extends(AttackSlot, _super);
    function AttackSlot(ID, player) {
        return _super.call(this, ID, player) || this;
    }
    return AttackSlot;
}(Slot_1.Slot));
exports.AttackSlot = AttackSlot;
