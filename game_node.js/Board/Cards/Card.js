"use strict";

function Card (cardName, cardCost, cardLife, cardAttack, cardPowerList = []) {
    let name = cardName;
    let currentLife = cardLife;
    let cost = cardCost;
    let maxLife = cardLife;
    let attack = cardAttack;
    let powerList = cardPowerList;
    let slot = null;

    this.getName = function() { return name; };
    this.getcost = function() { return cost; };
    this.getCurrentLife = function() { return currentLife; };
    this.getMaxLife = function() { return maxLife; };
    this.getAttack = function() { return attack; };
    this.getPowerList = function() { return powerList; };
    this.getSlot = function() { return slot };

    this.decreaseLife = function(damages) { 
        currenLife -= damages; 
        if(currentLife <= 0) {
            currentLife = 0;
            if(slot !== null) {
                slot.discard();
            }
        }
    };

    this.increaseLife = function(quantity) {
        currentLife += quantity;
        if(currentLife > maxLife)
            currentLife = maxLife;
    }

    this.setMaxLife = function(newMaxLife) {
        maxLife = newMaxLife;
        if(maxLife < 1)
            maxLife = 1;
    };

    this.decreaseAttack = function(value) {
        attack -= value;
        if(attack < 0)
            attack = 0;
    };

    this.increaseAttack = function(value) {
        attack += value;
    }
    
    this.addNewPower = function(power) {
        powerList.push(power);
    }

    this.removePower = function(index) {
        powerList = powerList.filter( (val, i) => (i === index) ? false : true );
    }

    this.setSlot = function(newSlot) {
        if(! newSlot instanceof Slot)
            throw new cardException("The parameter must be of type 'Slot'.");
        else
            slot = newSlot;
    }
}

function cardException(message) {
    this.message = message;
}
