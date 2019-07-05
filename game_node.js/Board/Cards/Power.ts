import { PowerIdentity } from "./PowerIdentity";

enum Type {
    Init,
    Active,
    ActiveOverload,
    Cyclical
}

enum Scope {
    Row,
    Column,
    Aside,
    Left,
    Right,
    Targeting,
    AllAllies,
    AllEnemies,
    All,
    AllButMe,
    Self,
    Custom
}

export class Power {
    public static readonly Type = Type;

    private name: string;
    private cost: number;
    private overLoad: number;
    private text: string;
    private counter: number;
    private type: number;
    private scope: number;
    private effect: Function;
    private event: Function;

    public constructor (powerIdentity: PowerIdentity) {
        this.name = powerIdentity.name;
        this.cost = powerIdentity.cost;
        this.overLoad = 0;
        this.text = powerIdentity.text;
        this.counter = powerIdentity.counter;
        this.type = powerIdentity.type;
        this.scope = powerIdentity.scope;
        this.effect = require('./' + powerIdentity.effectFile).effect;
        this.event = require('./' + powerIdentity.effectFile).event;
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
     * Setter $name
     * @param {string} value
     */
	public setName(value: string) {
		this.name = value;
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
     * Setter text
     * @param {string} value
     */
	public setText(value: string) {
		this.text = value;
	}

    /**
     * Setter counter
     * @param {number} value
     */
	public setCounter(value: number) {
		this.counter = value;
	}

    /**
     * Setter type
     * @param {number} value
     */
	public setType(value: number) {
		this.type = value;
	}

    /**
     * Setter scope
     * @param {number} value
     */
	public setScope(value: number) {
		this.scope = value;
	}

    /**
     * Setter effect
     * @param {Function} value
     */
	public setEffect(value: Function) {
		this.effect = value;
	}
        
}
