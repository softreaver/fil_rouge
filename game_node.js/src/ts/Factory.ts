"use strict";

import { Logger } from "./Logger";
import { Global } from "./Global";

export abstract class Factory {
    public static getLogger (): Logger {
        return Logger.getInstance();
    }

    public static getPool () {
        return new Global.pool(Global.poolParams);
    }
}
