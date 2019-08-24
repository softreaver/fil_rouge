import { Listener } from "./Listener";

export class CardEventListener {
    private map: Map<string, Listener>;

    public constructor (readonly context: object) {
        for (let methodName in context) {
            if (typeof context[methodName] === 'function' && !this.map.has(methodName)) {
                this.map.set(methodName, new Listener());
            }
        }
    }

    public getListener (methodName: string): Listener {
        return this.map.has(methodName) ? this.map.get(methodName) : null;
    }

}
