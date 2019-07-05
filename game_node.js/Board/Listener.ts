
enum Triger {
    Prevent,
    Before,
    After
}

export class Listener {
    public static readonly Triger = Triger;

    private prevent: Function[];
    private before: Function[];
    private after: Function[];

    public constructor () {
        this.prevent = [];
        this.before = [];
        this.after = [];
    }

    public addEvent (triger: number, effect: Function): void {
        switch(triger) {
            case Triger.Prevent:
                this.prevent.push(effect);
                break;
            case Triger.Before:
                this.before.push(effect);
                break;
            case Triger.After:
                this.after.push(effect);
                break;
            default:
        }
    }

    public removeEvent (triger: number, effect: Function): void {
        let index;
        switch(triger) {
            case Triger.Prevent:
                index = this.prevent.indexOf(effect);
                if (index !== -1) {
                    this.prevent.splice(index, 1);
                }
                break;
            case Triger.Before:
                index = this.before.indexOf(effect);
                    if (index !== -1) {
                        this.before.splice(index, 1);
                    }
                break;
            case Triger.After:
                index = this.after.indexOf(effect);
                    if (index !== -1) {
                        this.after.splice(index, 1);
                    }
                break;
            default:
        }
    }

    public getEventList (triger: number): Function[] {
        let valueToReturn;
        switch(triger) {
            case Triger.Prevent:
                valueToReturn = this.prevent;
                break;
            case Triger.Before:
                valueToReturn = this.before;
                break;
            case Triger.After:
                valueToReturn = this.after;
                break;
            default:
                valueToReturn = [];
        }
        return valueToReturn;
    }
}
