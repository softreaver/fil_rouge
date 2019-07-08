"use strict";

import { CardEventListener } from "../CardEventListener";
import { NoSuchMethod } from "../../Exceptions/SpecialExceptions";

export class Card {
    private name: string;
    private imageURL: string;
    private maxLife: number;
    private currentLife: number;
    private initialLife: number;
    private initialDef: number;
    private currentDef: number;
    private isVisible: boolean;
    private cardEventListener: CardEventListener;
    private variables: object;

    public constructor (name: string, imageURL: string, initialLife: number, initialDef: number) {
        this.name = name;
        this.imageURL = imageURL;
        this.initialLife = initialLife;
        this.currentLife = initialLife;
        this.maxLife = initialLife;
        this.initialDef = initialDef;
        this.currentDef = initialDef;
        this.isVisible = null;
        this.cardEventListener = new CardEventListener(this);
        this.variables = {};
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
}

