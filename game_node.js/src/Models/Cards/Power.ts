import { PowerIdentity } from "./PowerIdentity";
import { CardEvent } from "./CardEvent";

enum Type {
    Init,
    Active,
    ActiveOverload,
    Cyclical
}

enum Scope {
    Row,            // All the row but the card owning this power
    Column,         // All the column but the card owning this power
    Aside,          // The cards on the right and left
    Left,           // The card on the left
    Right,          // The card on the right
    Targeting,      // Choosed by the card's owner
    AllAllies,      // All allies
    AllEnemies,     // All ennemies
    All,            // All cards on the board
    AllButMe,       // All cards on the board but the one owning this power
    Self,           // The card owning this power
    Custom          // Targeting logic must be implemented using card slots methods
}

export class Power {
    public static readonly Type = Type;
    public static readonly Scope = Scope;

    private name: string;
    private cost: number;
    private overLoad: number;
    private text: string;
    private counter: number;
    private type: number;
    private scope: number;
    private effect: Function;
    private events: CardEvent[];

    public constructor (powerIdentity: PowerIdentity) {
        this.name = powerIdentity.name;
        this.cost = powerIdentity.cost;
        this.overLoad = 0;
        this.text = powerIdentity.text;
        this.counter = powerIdentity.counter;
        this.type = powerIdentity.type;
        this.scope = powerIdentity.scope;
        this.effect = require('./' + powerIdentity.effectFile).effect;
        this.events = require('./' + powerIdentity.effectFile).events || null;
    }

    /**
     * Getter name
     * @return {string}
     */
	public getName(): string {
		return this.name;
	}

    /**
     * Getter cost
     * @return {number}
     */
	public getCost(): number {
		return this.cost;
	}

    /**
     * Getter overLoad
     * @return {number}
     */
	public getOverLoad(): number {
		return this.overLoad;
	}

    /**
     * Getter text
     * @return {string}
     */
	public getText(): string {
		return this.text;
	}

    /**
     * Getter counter
     * @return {number}
     */
	public getCounter(): number {
		return this.counter;
	}

    /**
     * Getter type
     * @return {number}
     */
	public getType(): number {
		return this.type;
	}

    /**
     * Getter scope
     * @return {number}
     */
	public getScope(): number {
		return this.scope;
	}

    /**
     * Getter effect
     * @return {Function}
     */
	public getEffect(): Function {
		return this.effect;
    }
    
    /**
     * Getter events
     * @return {Function}
     */
	public getEvents(): CardEvent[] {
		return this.events;
    }

    /**
     * Setter cost
     * @param {number} value
     */
	public setCost(value: number) {
		this.cost = value;
	}

    /**
     * Setter overLoad
     * @param {number} value
     */
	public setOverLoad(value: number) {
		this.overLoad = value;
	}

    /**
     * Setter counter
     * @param {number} value
     */
	public setCounter(value: number) {
		this.counter = value;
	}
        
}
