import { EventTargetable } from "../EventTargetable";
import { Card } from "./Card";

export class CardEvent {

    private turnsLeft: number;
    private effect: Function;
    private target: EventTargetable;
    private from: Card;

    public constructor (from: Card, duration: number, effect: Function) {
        this.turnsLeft = duration;
        this.effect = effect;
        this.target = null;
        this.from = from;
    }

    public decreaseTimer (amount: number = 1) {
        if (this.turnsLeft > 0 && amount > 0) { 
            this.turnsLeft -= amount;

            if (this.turnsLeft < 0) { this.turnsLeft = 0; }
        }
    }

    public increaseTimer (amount: number = 1) {
        if (amount > 0) {
            this.turnsLeft += amount;
        }
    }

    public getTimer () : number {
        return this.turnsLeft;
    }

    public getTarget (): EventTargetable {
        return this.target;
    }

    public setTarget (target: EventTargetable) {
        this.target = target;
    }

    public getEffect (): Function {
        return this.effect;
    }
}
