"use strict";

const Interface = require('./Interface');
const Card = require('./Card');
const MonObjet = require('./MonObjet');

let obj = MonObjet;

Interface.checkImplements(obj, Card);
obj.effect();
console.log(obj.constructor);
