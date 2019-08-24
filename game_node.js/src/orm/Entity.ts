"use strict";

export class Entity {
    
    public constructor () {
        // Create getters and setters
        Object.keys(this).forEach(prop => {
            if (typeof this[prop] != 'function') {
                let setter = 'set' + prop.substr(0, 1).toUpperCase() + prop.substr(1);
                let getter = 'get' + prop.substr(0, 1).toUpperCase() + prop.substr(1);
                this[setter] = function (value: typeof prop): void {
                    this[prop] = value;
                }
                this[getter] = function (): typeof prop {
                    return this[prop];
                }
            }
        });
    }

}
