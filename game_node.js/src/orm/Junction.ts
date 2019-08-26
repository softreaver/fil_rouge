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
    private otherEntity: string;

    public constructor (type: number, foreignKey: string, targetCol: string, targetTable: string, otherEntity: string) {
        this.type = type;
        this.foreignKey = foreignKey;
        this.targetCol = targetCol;
        this.targetTable = targetTable;
        this.otherEntity = otherEntity;
    }

    public getType(): number {
        return this.type;
    }

    public getForeignKey(): string {
        return this.foreignKey;
    }

    public getTargetCol(): string {
        return this.targetCol;
    }

    public getTargetTable(): string {
        return this.targetTable;
    }

    public getOtherEntity(): string {
        return this.otherEntity;
    }
}
