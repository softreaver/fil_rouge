import { Card, MagicCard, ENUM } from './test';

let myCard = new MagicCard("carte magique", 13);

let card: Card;

card = myCard;

console.log(card.getLife());
card.decreaseLife(12);
console.log(myCard.getLife());

let collectionName = 'testCollection';

let collection = require("./" + collectionName);
collection.getCollection();

console.log('Enum = ' + ENUM.ONE);
