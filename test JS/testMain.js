"use strict";
exports.__esModule = true;
var test_1 = require("./test");
var myCard = new test_1.MagicCard("carte magique", 13);
var card;
card = myCard;
console.log(card.getLife());
card.decreaseLife(12);
console.log(myCard.getLife());
var collectionName = 'testCollection';
var collection = require("./" + collectionName);
collection.getCollection();
console.log('Enum = ' + test_1.ENUM.ONE);