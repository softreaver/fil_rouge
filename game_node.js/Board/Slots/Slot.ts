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

    public readonly _addEvent = 'addEvent';
    public addEvent(cardEvent: CardEvent) {
        this.eventsList.push(cardEvent);
    }

    public readonly _removeEvent = 'removeEvent';
    public removeEvent(cardEvent: CardEvent) {
        let index = this.eventsList.indexOf(cardEvent);

        if (index !== -1) {
            this.eventsList.splice(index, 1);
        } else {
            throw new NotDoneException("The given card event was not found.", "Aucun évennement de ce type trouvé sur la cible.");
        }
    }

    public readonly _addToEventListener = 'addToEventListener';
    public addToEventListener(cardEvent: CardEvent, methodName: string) {
        
    }

    public readonly _removeFromEventListener = 'removeFromEventListener';
    public removeFromEventListener(cardEvent: CardEvent) {
        throw new Error("Method not implemented.");
    }

    public readonly _hasCard = 'hasCard';
    private hasCard(): boolean {
        return this.card === null ? false : true;
    }

    public readonly _discard = 'discard';
    private discard(): void {
        if (this.hasCard) {
            
        }
    }

    public readonly _getID = 'getID';
    /**
     * Getter ID
     * @return {string}
     */
	private getID(): number {
		return this.ID;
    }
    
    public readonly _getPlayer = 'getPlayer';
    /**
     * Getter Player
     * @return {string}
     */
	private getPlayer(): Player {
		return this.player;
	}

    public readonly _getCardEventListener = 'getCardEventListener';
    /**
     * Getter cardEventListener
     * @return {CardEventListener}
     */
	private getCardEventListener(): CardEventListener {
		return this.cardEventListener;
	}

    public readonly _getLeftSlot = 'getLeftSlot';
    /**
     * Getter leftSlot
     * @return {Slot}
     */
	private getLeftSlot(): Slot {
		return this.leftSlot;
	}

    public readonly _getRightSlot = 'getRightSlot';
    /**
     * Getter rightSlot
     * @return {Slot}
     */
	private getRightSlot(): Slot {
		return this.rightSlot;
	}

    public readonly _getFrontSlot = 'getFrontSlot';
    /**
     * Getter frontSlot
     * @return {Slot}
     */
	private getFrontSlot(): Slot {
		return this.frontSlot;
	}

    public readonly _getBackSlot = 'getBackSlot';
    /**
     * Getter backSlot
     * @return {Slot}
     */
	private getBackSlot(): Slot {
		return this.backSlot;
	}

    public readonly _getCard = 'getCard';
    /**
     * Getter card
     * @return {Card}
     */
	private getCard(): Card {
		return this.card;
	}

    public readonly _setID = 'setID';
    /**
     * Setter ID
     * @param {string} value
     */
	private setID(value: number) {
		this.ID = value;
	}

    public readonly _setCardEventListener = 'setCardEventListener';
    /**
     * Setter cardEventListener
     * @param {CardEventListener} value
     */
	private setCardEventListener(value: CardEventListener) {
		this.cardEventListener = value;
	}

    public readonly _setLeftSlot = 'setLeftSlot';
    /**
     * Setter leftSlot
     * @param {Slot} value
     */
	private setLeftSlot(value: Slot) {
		this.leftSlot = value;
	}

    public readonly _setRightSlot = 'setRightSlot';
    /**
     * Setter rightSlot
     * @param {Slot} value
     */
	private setRightSlot(value: Slot) {
		this.rightSlot = value;
	}

    public readonly _setFrontSlot = 'setFrontSlot';
    /**
     * Setter frontSlot
     * @param {Slot} value
     */
	private setFrontSlot(value: Slot) {
		this.frontSlot = value;
	}

    public readonly _setBackSlot = 'setBackSlot';
    /**
     * Setter backSlot
     * @param {Slot} value
     */
	private setBackSlot(value: Slot) {
		this.backSlot = value;
	}

    public readonly _setCard = 'setCard';
    /**
     * Setter card
     * @param {Card} value
     */
	private setCard(value: Card) {
		this.card = value;
	}
}
