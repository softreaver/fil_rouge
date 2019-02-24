"use strict";
exports.__esModule = true;
var CardEventListener_1 = require("../CardEventListener");
var SpecialExceptions_1 = require("../../Exceptions/SpecialExceptions");
/**
 * @abstract
 * @class
 * @classdesc Represents a space where cards go. This class is abstract as you can have eather Attack slot or Defnse slot.
 */
var Slot = /** @class */ (function () {
    function Slot(ID, player) {
        this.cardEventListener = new CardEventListener_1.CardEventListener(this);
        this.ID = ID;
        this.player = player;
        this.leftSlot = null;
        this.rightSlot = null;
        this.backSlot = null;
        this.frontSlot = null;
        this.card = null;
    }
    Slot.prototype["do"] = function (methodName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (typeof this[methodName] === 'function') {
            // first check if any listener is hooked to this method
            // do method
            this[methodName](args);
            // play any event 'after' hooked to this method
        }
        else {
            throw new SpecialExceptions_1.NoSuchMethod("No such method : " + methodName, "L'action demandée n'a pas fonctionnée.");
        }
    };
    Slot.prototype.addEvent = function (cardEvent) {
        this.eventsList.push(cardEvent);
    };
    Slot.prototype.removeEvent = function (cardEvent) {
        var index = this.eventsList.indexOf(cardEvent);
        if (index !== -1) {
            this.eventsList.splice(index, 1);
        }
        else {
            throw new SpecialExceptions_1.NotDoneException("The given card event was not found.", "Aucun évennement de ce type trouvé sur la cible.");
        }
    };
    Slot.prototype.addToEventListener = function (cardEvent, methodName) {
    };
    Slot.prototype.removeFromEventListener = function (cardEvent) {
        throw new Error("Method not implemented.");
    };
    Slot.prototype.hasCard = function () {
        return this.card === null ? false : true;
    };
    Slot.prototype.discard = function () {
        if (this.hasCard) {
        }
    };
    /**
     * Getter ID
     * @return {string}
     */
    Slot.prototype.getID = function () {
        return this.ID;
    };
    /**
     * Getter Player
     * @return {string}
     */
    Slot.prototype.getPlayer = function () {
        return this.player;
    };
    /**
     * Getter cardEventListener
     * @return {CardEventListener}
     */
    Slot.prototype.getCardEventListener = function () {
        return this.cardEventListener;
    };
    /**
     * Getter leftSlot
     * @return {Slot}
     */
    Slot.prototype.getLeftSlot = function () {
        return this.leftSlot;
    };
    /**
     * Getter rightSlot
     * @return {Slot}
     */
    Slot.prototype.getRightSlot = function () {
        return this.rightSlot;
    };
    /**
     * Getter frontSlot
     * @return {Slot}
     */
    Slot.prototype.getFrontSlot = function () {
        return this.frontSlot;
    };
    /**
     * Getter backSlot
     * @return {Slot}
     */
    Slot.prototype.getBackSlot = function () {
        return this.backSlot;
    };
    /**
     * Getter card
     * @return {Card}
     */
    Slot.prototype.getCard = function () {
        return this.card;
    };
    /**
     * Setter ID
     * @param {string} value
     */
    Slot.prototype.setID = function (value) {
        this.ID = value;
    };
    /**
     * Setter cardEventListener
     * @param {CardEventListener} value
     */
    Slot.prototype.setCardEventListener = function (value) {
        this.cardEventListener = value;
    };
    /**
     * Setter leftSlot
     * @param {Slot} value
     */
    Slot.prototype.setLeftSlot = function (value) {
        this.leftSlot = value;
    };
    /**
     * Setter rightSlot
     * @param {Slot} value
     */
    Slot.prototype.setRightSlot = function (value) {
        this.rightSlot = value;
    };
    /**
     * Setter frontSlot
     * @param {Slot} value
     */
    Slot.prototype.setFrontSlot = function (value) {
        this.frontSlot = value;
    };
    /**
     * Setter backSlot
     * @param {Slot} value
     */
    Slot.prototype.setBackSlot = function (value) {
        this.backSlot = value;
    };
    /**
     * Setter card
     * @param {Card} value
     */
    Slot.prototype.setCard = function (value) {
        this.card = value;
    };
    return Slot;
}());
exports.Slot = Slot;
