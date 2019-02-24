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
var Exception_1 = require("./Exception");
var NotDoneException = /** @class */ (function (_super) {
    __extends(NotDoneException, _super);
    function NotDoneException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotDoneException;
}(Exception_1.Exception));
exports.NotDoneException = NotDoneException;
var NoSuchMethod = /** @class */ (function (_super) {
    __extends(NoSuchMethod, _super);
    function NoSuchMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoSuchMethod;
}(Exception_1.Exception));
exports.NoSuchMethod = NoSuchMethod;
