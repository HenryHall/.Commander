
// var pool = require('./connection');

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: require('./connection.js')
});

var checkUsers = function(user_id, callback){
  console.log("Checking users:", user_id);

  if(!user_id){
    //Handle no session data  **FIX**
    return callback(false);
  }

  pool.query('SELECT * FROM members WHERE "auth0_ID" = $1', [user_id], (err, result) => {
    if(err){
      console.log(err.stack);
    } else if (result.rowCount == 0){
      pool.query('INSERT INTO members("auth0_ID") VALUES ($1) RETURNING "memberID"', [user_id], (err, res) => {
        if(err){
          console.log(err.stack);
        } else {
          console.log("New user added");
        }
      });
    } else {
      console.log("Found a match, repeat user.  No action");
    }
    return callback(true);
  });
}

module.exports = checkUsers;
