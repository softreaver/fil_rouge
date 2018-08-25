"use strict";

function MonObjet() {
    this.effect = function() {
        console.log('kaboum!');
    }
}

module.exports = new MonObjet();
