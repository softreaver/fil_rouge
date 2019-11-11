"use strict";

import { PostgresDAOException } from "../Exceptions/SpecialExceptions";
import { Factory } from "../Factory2";
import { Persistor } from "./Persistor";
import { Repository } from "./Repository";
import { Entity } from "./Entity";

/**
 * §@PostgresORM
 */
export class PostgresTransaction implements Persistor {
    public static readonly ERROR_MESSAGE_IHM   = "Problème lors de la transaction avec la base de données.";
    private readonly pool = Factory.getPool();
    private autoCommit: boolean;
    private autoGeneratedKey: number;

    setAutoCommit(autoCommit: boolean): void {
        throw new Error("Method not implemented.");
    }
    getAutoGeneratedKey(): number {
        throw new Error("Method not implemented.");
    }
    insert(repository: Repository, entities: Entity | Entity[]): number {
        throw new Error("Method not implemented.");
    }
    delete(repository: Repository, entityToRemove: Entity): number {
        throw new Error("Method not implemented.");
    }
    update(repository: Repository, entityToUpdate: Entity): number {
        throw new Error("Method not implemented.");
    }
    findAll(repository: Repository): Entity[] {
        throw new Error("Method not implemented.");
    }
    deleteWhere(repository: Repository, conditions: any): number {
        throw new Error("Method not implemented.");
    }
    findWhere(repository: Repository, conditions: any): Entity[] {
        throw new Error("Method not implemented.");
    }
    findOne(repository: Repository, PKValue: any): Entity {
        throw new Error("Method not implemented.");
    }

    /**
     * A full generic function that take all queries to perform a transaction.
     * 
     * @private
     * @function makeTransaction
     * 
     * @param {array} queries An array containing query = {text: 'the SQL query' [, params: [an array of parameter] ] } If you want to retrieve a specific value from previous query from RETURNING, use the parameter as '#<columnName>'.
     * @example <caption>Parameter example</caption>
     * // The second query will use the id of the previously insered user (see #id)
     * [
     *      {
     *          text: 'INSERT INTO users(pseudo) VALUES($1) RETURNING id',
     *          params: ['tata']
     *      },
     *      {
     *          text: 'INSERT INTO photos(id_users, url) VALUES ($1, $2)',
     *          params: ['#id', 'url/de/la/photo.png']
     *      }
     * ]
     * 
     * @throws PostgresDAOException
     * 
     * @return {void}
     */
    private makeTransaction(queries) {
        if(!Array.isArray(queries))
            throw new PostgresDAOException('The parameter given must be an Array.', PostgresTransaction.ERROR_MESSAGE_IHM);

        this.pool.connect((err, client, done) => {

            const shouldAbort = (err) => {
                if (err) {
                    console.error('Error in SQL transaction', err.stack);
                    client.query('ROLLBACK', (err) => {
                        // release the client back to the pool
                        done();
                        if (err) {
                            console.error('Error rolling back client', err.stack);
                        }
                    })
                }
                return !!err
            }
            
            client.query('BEGIN', (err) => {
                
                function makeQuery(err, res = null) {
                    if (shouldAbort(err)) throw new PostgresDAOException('Error in SQL transaction : ' + err.stack, PostgresTransaction.ERROR_MESSAGE_IHM);

                    if(queries.length > 0) {
                        let currentQueryText = queries[0].text || null;
                        let currentQueryParams = queries[0].params || [];
                        queries.splice(0, 1);
        
                        if(currentQueryText !== null && Array.isArray(currentQueryParams)) {
                            // Resolve param values
                            if(res) {
                                currentQueryParams.forEach((param, index) => {
                                    if(typeof param ==="string") {
                                        if(param.indexOf('#') === 0) {
                                            currentQueryParams[index] = res.rows[0][param.substr(1)] || param;
                                        }
                                    }
                                });
                            }
                            
                            client.query(currentQueryText, currentQueryParams, (queries.length > 0) ? makeQuery : endOfTransaction);
                        }
                    }
                };

                function endOfTransaction(err) {
                    if (shouldAbort(err)) throw new PostgresDAOException('Error in SQL transaction : ' + err.stack, PostgresTransaction.ERROR_MESSAGE_IHM);

                    client.query('COMMIT', (err) => {
                        done();
                        if (err) {
                            throw new PostgresDAOException('Error committing transaction : ' + err.stack, PostgresTransaction.ERROR_MESSAGE_IHM);
                        }
                    });
                }

                // Start the transaction with the first query
                makeQuery(err);
            })
        });
    }
}


