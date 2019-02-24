import { Card } from "../Cards/Card";
import { CardEventListener } from "../CardEventListener";
import { EventTargetable } from "../EventTargetable";
import { CardEvent } from "../Cards/CardEvent";
import { Player } from "../../Users/Player";
import { NotDoneException, NoSuchMethod } from "../../Exceptions/SpecialExceptions";
import { Listenable } from "../Listenable";

/**
 * @abstract
 * @class
 * @classdesc Represents a space where cards go. This class is abstract as you can have eather Attack slot or Defnse slot.
 */
export abstract class Slot implements EventTargetable, Listenable {
    private ID: number;
    private player: Player;
    private eventsList: CardEvent[];
    private cardEventListener: CardEventListener;
    private leftSlot: Slot;
    private rightSlot: Slot;
    private frontSlot: Slot;
    private backSlot: Slot;
    private card: Card;
    
    protected constructor (ID: number, player: Player) {
        this.cardEventListener = new CardEventListener(this);
        this.ID = ID;
        this.player = player;
        this.leftSlot = null;
        this.rightSlot = null;
        this.backSlot = null;
        this.frontSlot = null;
        this.card = null;
    }

    public do (methodName: string, ...args: any[]) {
        if (typeof this[methodName] === 'function') {
            // first check if any listener is hooked to this method

            // do method
            this[methodName](args);

            // play any event 'after' hooked to this method

        } else {
            throw new NoSuchMethod("No such method : " + methodName, "L'action demandée n'a pas fonctionnée.");
        }
    }

    public addEvent(cardEvent: CardEvent) {
        this.eventsList.push(cardEvent);
    }

    public removeEvent(cardEvent: CardEvent) {
        let index = this.eventsList.indexOf(cardEvent);

        if (index !== -1) {
            this.eventsList.splice(index, 1);
        } else {
            throw new NotDoneException("The given card event was not found.", "Aucun évennement de ce type trouvé sur la cible.");
        }
    }

    public addToEventListener(cardEvent: CardEvent, methodName: string) {
        
    }

    public removeFromEventListener(cardEvent: CardEvent) {
        throw new Error("Method not implemented.");
    }

    private hasCard(): boolean {
        return this.card === null ? false : true;
    }

    private discard(): void {
        if (this.hasCard) {
            
        }
    }

    /**
     * Getter ID
     * @return {string}
     */
	private getID(): number {
		return this.ID;
    }
    
    /**
     * Getter Player
     * @return {string}
     */
	private getPlayer(): Player {
		return this.player;
	}

    /**
     * Getter cardEventListener
     * @return {CardEventListener}
     */
	private getCardEventListener(): CardEventListener {
		return this.cardEventListener;
	}

    /**
     * Getter leftSlot
     * @return {Slot}
     */
	private getLeftSlot(): Slot {
		return this.leftSlot;
	}

    /**
     * Getter rightSlot
     * @return {Slot}
     */
	private getRightSlot(): Slot {
		return this.rightSlot;
	}

    /**
     * Getter frontSlot
     * @return {Slot}
     */
	private getFrontSlot(): Slot {
		return this.frontSlot;
	}

    /**
     * Getter backSlot
     * @return {Slot}
     */
	private getBackSlot(): Slot {
		return this.backSlot;
	}

    /**
     * Getter card
     * @return {Card}
     */
	private getCard(): Card {
		return this.card;
	}

    /**
     * Setter ID
     * @param {string} value
     */
	private setID(value: number) {
		this.ID = value;
	}

    /**
     * Setter cardEventListener
     * @param {CardEventListener} value
     */
	private setCardEventListener(value: CardEventListener) {
		this.cardEventListener = value;
	}

    /**
     * Setter leftSlot
     * @param {Slot} value
     */
	private setLeftSlot(value: Slot) {
		this.leftSlot = value;
	}

    /**
     * Setter rightSlot
     * @param {Slot} value
     */
	private setRightSlot(value: Slot) {
		this.rightSlot = value;
	}

    /**
     * Setter frontSlot
     * @param {Slot} value
     */
	private setFrontSlot(value: Slot) {
		this.frontSlot = value;
	}

    /**
     * Setter backSlot
     * @param {Slot} value
     */
	private setBackSlot(value: Slot) {
		this.backSlot = value;
	}

    /**
     * Setter card
     * @param {Card} value
     */
	private setCard(value: Card) {
		this.card = value;
	}
}
