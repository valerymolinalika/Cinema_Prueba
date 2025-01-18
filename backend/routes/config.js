const dotenv = require('dotenv');
dotenv.config();

const config = {
	user: process.env.PGUSER , //env var: PGUSER
	database: process.env.PGDATABASE , //env var: PGDATABASE
	password: process.env.PGPASSWORD , //env var: PGPASSWORD
	host: process.env.PGHOST , // Server hosting the postgres database
	port: process.env.PGPORT , //env var: PGPORT
	max: 10, // max number of clients in the pool
	idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
	api: process.env.API, // env var: API
};

module.exports = config;