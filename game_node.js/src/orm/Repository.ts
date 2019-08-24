"use strict";

import { Entity } from "./Entity";
import { Junction } from "./Junction";

export class Repository {
    
    private dbName: string;
    private schema: string;
    private table: string;
    private entity: Entity;
    private junctions: Junction[];

    public constructor (dbName: string, schema: string, table: string, entity: string, junctions: Junction[] = null) {
        this.dbName = dbName;
        this.schema = schema;
        this.table = table;
        this.entity = entity;
        this.junctions = junctions;
    }

    public insert (params: any[]) {

    }

    public delete (entityToRemove: Entity): void {

    }

    public update (entityToUpdate: Entity): void {

    }

    public find (args) {

    }
}
