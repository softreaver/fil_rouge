/// <reference path="/usr/lib/nodejs/typescript/lib/lib.es6.d.ts" />
import { Listener } from "./Listener";

export class CardEventListener {
    private map: Map<string, Listener>;

    public constructor (context: Object) {
        this.map = new Map<string, Listener>();
        for (let methodName in context) {
            if (typeof context[methodName] === 'function' && !this.map.has(methodName)) {
                this.map.set(methodName, new Listener());
            }
        }
    }

    
}
