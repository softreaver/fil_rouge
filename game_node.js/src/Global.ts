"use strict";

export abstract class Global {
    public static readonly LOGS_PATH:string     = './logs/';
    public static readonly fs                   = require('fs');
    public static readonly pool                 = require('pg').Pool;
    public static readonly poolParams           = {
        user: 'postgres',
        host: 'localhost',
        database: 'test_node',
        password: '',
        port: 5432,
    };
}
