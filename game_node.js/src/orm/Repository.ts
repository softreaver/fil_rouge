"use strict";

import { Entity } from "./Entity";
import { Junction } from "./Junction";

export class Repository {
    
    private dbName: string;
    private schema: string;
    private table: string;
    private entity: string;
    private junctions: Junction[];
    private autoCommit: boolean;

    public constructor (dbName: string, schema: string, table: string, entity: string, junctions: Junction[] = null) {
        this.dbName = dbName;
        this.schema = schema;
        this.table = table;
        this.entity = entity;
        this.junctions = junctions;
        this.autoCommit = true;
    }

    public insert (entities: Entity | Entity[]): number {
        return 0;
    }

    public delete (entityToRemove: Entity): number {
        return 0;
    }

    public update (entityToUpdate: Entity): number {
        return 0;
    }

    public findAll (): Entity[] {
        return [];
    }

    public deleteWhere (conditions): number {
        return 0;
    }

    public findWhere (conditions): Entity[] {
        return [];
    }

    public findOne (PKValue: any): Entity {
        return null;
    }
}
