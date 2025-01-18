const Pool = require('pg-pool'); 
const fs = require('fs'); 

var config = require('./config'); 
console.log(config); 
const pool = new Pool(config); 

// If an error is encountered by a client while it sits idle in the pool,
	// the pool itself will emit an error event with both the error and
	// the client which emitted the original error.
	// This is a rare occurrence but can happen if there is a network partition,
	// the database restarts.
	// Therefore, it's advisable to handle it and at least log it out.
pool.on('error', function (err, client) {
	console.error('idle client error', err.message, err.stack);
});

/**
 * Connect function
 * Returns a client from the connection pool for multiple operations, such as a transaction.
 * Logs a message indicating successful connection.
 * 
 * @param {function} callback - The callback function to be called after successful connection
 * @returns {object} - A client from the connection pool
 */
function connect(callback) {
	console.log('successful connection'); 
	return pool.connect(callback); 
}

module.exports = { connect, pool };
