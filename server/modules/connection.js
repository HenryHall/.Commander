
var connectionString = '';
if(process.env.DATABASE_URL !== undefined) {
 connectionString = process.env.DATABASE_URL;
 pg.defaults.ssl = true;
} else {
 connectionString = 'postgres://localhost:5432/commanderDash';
}

// module.exports = pool;
module.exports = connectionString;
