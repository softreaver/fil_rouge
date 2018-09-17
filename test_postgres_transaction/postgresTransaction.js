"user_strict";

const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test_node',
    password: '',
    port: 5432,
  });


  makeTransaction([
      {
          text: 'INSERT INTO users(pseudo) VALUES($1) RETURNING id',
          params: ['tata']
      },
      {
          text: 'INSERT INTO photos(id_users, url) VALUES ($1, $2)',
          params: ['#id', 'url/de/la/photo.png']
      }
  ]);



//======================================================================================

// Throws exception
function PostgresDAOException(message) {
    this.message = message;
}

/**
 * A full generic function that take all queries to perform a transaction.
 * 
 * @public
 * @function makeTransaction
 * @param {array} queries An array containing query = {text: 'the SQL query' [, params: [an array of parameter] ] } If you want to retrieve a specific value from RETURNING use the parameter as '#<columnName>'.
 */
function makeTransaction(queries) {
    if(!Array.isArray(queries))
        throw new PostgresDAOException('The parameter given must be an Array.');

    pool.connect((err, client, done) => {

        const shouldAbort = (err) => {
            if (err) {
                console.error('Error in SQL transaction', err.stack);
                client.query('ROLLBACK', (err) => {
                    if (err) {
                    console.error('Error rolling back client', err.stack);
                    }
                    // release the client back to the pool
                    done();
                })
            }
            return !!err
        }
        
        client.query('BEGIN', (err) => {
            
            function makeQuery(err, res) {
                if (shouldAbort(err)) throw new PostgresDAOException('Error in SQL transaction', err.stack);

                if(queries.length > 0) {
                    let currentQueryText = queries[0].text || null;
                    let currentQueryParams = queries[0].params || [];
                    queries.splice(0, 1);
    
                    if(currentQueryText !== null && Array.isArray(currentQueryParams)) {
                        // Resolve param values
                        if(res) {
                            currentQueryParams.forEach((param, index) => {
                                if(typeof param ==="string")
                                    if(param.indexOf('#') === 0) {
                                        currentQueryParams[index] = res.rows[0][param.substr(1)] || param;
                                    }
                            });
                        }
                        
                        client.query(currentQueryText, currentQueryParams, (queries.length > 0) ? makeQuery : endOfTransaction);
                    }
                }
            };

            function endOfTransaction(err) {
                if (shouldAbort(err)) throw new PostgresDAOException('Error in SQL transaction', err.stack);

                client.query('COMMIT', (err) => {
                    if (err) {
                        throw new PostgresDAOException('Error committing transaction', err.stack);
                    }
                    done();
                });
            }

            // Start the transaction with the first query
            makeQuery(err);
        })
    });
}
