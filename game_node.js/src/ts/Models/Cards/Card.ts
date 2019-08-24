"use strict";

import { CardEventListener } from "../CardEventListener";
import { NoSuchMethodException } from "../../Exceptions/SpecialExceptions";
import { Listener } from "../Listener";
import { Power } from "./Power";
import { CardEvent } from "./CardEvent";

export class Card {
    private name: string;
    private imageURL: string;
    private maxLife: number;
    private currentLife: number;
    private initialLife: number;
    private initialDef: number;
    private currentDef: number;
    private visible: boolean;
    private cardEventListener: CardEventListener;
    private powersList: Power[];
    private powerEventMap: Map<string, CardEvent[]>;
    private variables: object;

    public constructor (name: string, imageURL: string, initialLife: number, initialDef: number, powersList: Power[]) {
        this.name                   = name;
        this.imageURL               = imageURL;
        this.initialLife            = initialLife;
        this.currentLife            = initialLife;
        this.maxLife                = initialLife;
        this.initialDef             = initialDef;
        this.currentDef             = initialDef;
        this.visible                = false;
        this.variables              = {};
        this.powersList             = powersList;
        
        // Add powers to this instance
        powersList.forEach(function (power: Power) {
            this[power.getName()] = power.getEffect();
            
            // Map card event to this power if any
            if (power.getEvents().length > 0 && !this.powerEventMap.has(power.getName())) {
                this.powerEventMap.set(power.getName(), power.getEvents());
            }
        });
        
        this.cardEventListener      = new CardEventListener(this);
    }

    public do (methodName: string, ...args: any[]) {
        if (typeof this[methodName] === 'function') {
            // first check if any listener is hooked to this method and should prevent this action to happened
            let beforeEventsList: Function[] = this.cardEventListener.getListener(methodName).getEventList(Listener.Triger.Before);
            let preventEventsList: Function[] = this.cardEventListener.getListener(methodName).getEventList(Listener.Triger.Prevent);
            let afterEventsList: Function[] = this.cardEventListener.getListener(methodName).getEventList(Listener.Triger.After);

            // First play all before event effects
            for (let i = 0; i < beforeEventsList.length; ++i) {
                if (beforeEventsList[i]) {
                    beforeEventsList[i](this, args);
                }
            }

            // do method if no prevent effect is hooked to this card ...
            if (preventEventsList.length === 0) {
                this[methodName](args);

                // play any event 'after' hooked to this method
                for (let i = 0; i < afterEventsList.length; ++i) {
                    if (afterEventsList[i]) {
                        afterEventsList[i](this, args);
                    }
                }

            // ... otherwise, play all prevent effects
            } else {
                for (let i = 0; i < preventEventsList.length; ++i) {
                    if (preventEventsList[i]) {
                        preventEventsList[i](this, args);
                    }
                }
            }

        } else {
            throw new NoSuchMethodException("No such method : " + methodName, "L'action demandée n'a pas fonctionnée.");
        }
    }

    public getName (): string {
        return this.name;
    }

    public getImageURL (): string {
        return this.imageURL;
    }

    public getInitialLife (): number {
        return this.initialLife;
    }

    public getCurrentLife (): number {
        return this.currentLife;
    }

    public getMaxLife (): number {
        return this.maxLife;
    }

    public getInitialDef (): number {
        return this.initialDef;
    }

    public getCurrentDef (): number {
        return this.currentDef;
    }

    public isVisible (): boolean {
        return this.visible;
    }

    public getCardEventListener (): CardEventListener {
        return this.cardEventListener;
    }

    public getVariables (): object {
        return this.variables;
    }

    public setVisible (visible: boolean): void {
        this.visible = visible;
    }
}

