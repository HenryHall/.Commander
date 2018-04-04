
const { Pool } = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL !== undefined) {
 console.log('env connection string');
 connectionString = process.env.DATABASE_URL;
 pg.defaults.ssl = true;
} else {
 connectionString = 'postgres://localhost:5432/commanderDash';
}
console.log("connectionString set to: ", connectionString);

const pool = new Pool({
  connectionString: connectionString
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})



module.exports = pool;
