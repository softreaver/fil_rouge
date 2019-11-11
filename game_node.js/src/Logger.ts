"use strict";

import { Global } from "./Global";

enum Level {
    trace,
    debug,
    info,
    warning,
    error,
    critical
}

let LEVEL = [
    'TRACE',
    'DEBUG',
    'INFO',
    'WARNING',
    'ERROR',
    'CRITICAL'
];

/**
 * § @Logger!
 */
export class Logger {
    private static instance: Logger;
    private static readonly LOGS_PATH = Global.LOGS_PATH;

    private oStream;
    private dateInt: number;

    private constructor () {
        let dateStr = new Date().toISOString().substr(0, 10);
        this.dateInt = Number.parseInt(dateStr.replace('-', ''));
        this.oStream = Global.fs.createWriteStream(Logger.LOGS_PATH + 'log-' + dateStr + '.txt');
    }

    private log (level: number, message: string, appliName: string): void {
        // Before check if we still write into the right logfile depending on the date
        let dateStr = new Date().toISOString().substr(0, 10);
        let dateInt = Number.parseInt(dateStr.replace('-', ''));
        if (dateInt !== this.dateInt) {
            // Change stream
            this.oStream = Global.fs.createWriteStream(Logger.LOGS_PATH + 'log-' + dateStr + '.txt');
        }

        let time:number = new Date().getTime();
        let appli = ( !appliName ) ? ' - ' : '[' + appliName + '] - ';
        let messageToLog = time + ' [' + LEVEL[level] + ']' + appli + message;

        this.oStream.write(messageToLog);
    }

    public static getInstance (): Logger {
        if ( !Logger.instance ) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public trace (message: string, appliName: string = null): void {
        this.log(Level.trace, message, appliName);
    }

    public debug (message: string, appliName: string = null): void {
        this.log(Level.debug, message, appliName);
    }

    public info (message: string, appliName: string = null): void {
        this.log(Level.info, message, appliName);
    }

    public warning (message: string, appliName: string = null): void {
        this.log(Level.warning, message, appliName);
    }

    public error (message: string, appliName: string = null): void {
        this.log(Level.error, message, appliName);
    }

    public critical (message: string, appliName: string = null): void {
        this.log(Level.critical, message, appliName);
    }
}
