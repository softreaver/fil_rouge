"use strict";

enum TYPE {
    References,         // Means that this repository references another repository (the foreignKey is inside this repository)
    IsReferenced        // Means that this repository is being referenced by another repository (foreignKey in the other repository)
}

export class Junction {

    public static readonly TYPE = TYPE;
    private type:number;
    private foreignKey:string;
    private targetCol:string;
    private targetTable:string;

    public constructor (type: number, foreignKey: string, targetCol: string, targetTable: string) {

    }

}
