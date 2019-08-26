"use strict";

export class Query {
    private sql: string;
    private params: any[];

    public constructor (sql: string, params: any[]) {
        this.sql = sql;
        this.params = params;
    }

    public getSql(): string {
        return this.sql;
    }

    public getParams(): any[] {
        return this.params;
    }
}
