"use strict";

function OtherObject(){
    this.property = "ok";
    var base = new MonObjet();

    this.getSlot = function() {
        return base.getSlot();
    }
}
