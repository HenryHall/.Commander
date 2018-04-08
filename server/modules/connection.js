
var connectionString = '';
if(process.env.DATABASE_URL !== undefined) {
 connectionString = process.env.DATABASE_URL;
 // pg.defaults.ssl = true;
} else {
 connectionString = 'postgres://localhost:5432/commanderDash?ssl=true';
}

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: connectionString,
  ssl: true
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

module.exports = pool;
