import { Card } from "./Cards/Card";
import { Utils } from "../Utils";

export class Deck {
    private cardList: Card[];

    public shuffle(): void {
        let index: number;
        let newCardList: Card[] = [];

        while (this.cardList.length > 0) {
            index = Utils.getRandomInt(0, this.cardList.length);
            newCardList.push(this.cardList[index]);
            this.cardList.splice(index, 1);
        }
        
        this.cardList = newCardList;
    }

    public putOnTop(card: Card): void {
        this.cardList.splice(0, 0, card);
    }

    public putUnder (card: Card): void {
        this.cardList.push(card);
    }

    public remove(card: Card): void {
        let index = this.cardList.indexOf(card);

        if (index !== -1) {
            this.cardList.splice(index, 1);
        }
    }

    public getAllCard(): Card[] {
        let cardList = [];
        this.cardList.forEach(card => {
            cardList.push(card);
        });
        return cardList;
    }

    public draw(card: Card = null): Card {
        let cardToReturn = null;
        let index = (card === null)? 0 : this.cardList.indexOf(card);

        if (index !== -1) {
            cardToReturn = this.cardList[index];
            this.cardList.splice(index, 1);
        }

        return cardToReturn;
    }
}
