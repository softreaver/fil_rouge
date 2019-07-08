import { CardEvent } from "./Cards/CardEvent";

export interface EventTargetable {    
    addEvent(cardEvent: CardEvent);
    removeEvent(cardEvent: CardEvent);
    addToEventListener(cardEvent: CardEvent, methodName: string);
    removeFromEventListener(cardEvent: CardEvent);
}
