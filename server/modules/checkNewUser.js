
// var pg = require('pg');
// var connection = require('./connection');
var pool = require('./connection');

var checkUsers = function(user_id, user_name){
  console.log("Checking users:", user_id, user_name);

  if(!user_id){
    //Handle no session data  **FIX**
    return false;
  }
  user_name = user_name ? user_name : "Anon User";

  pool.query('SELECT * FROM members WHERE "auth0_ID" = $1', [user_id], (err, result) => {
    if(err){
      console.log(err.stack);
    } else if (result.rowCount == 0){
      pool.query('INSERT INTO members("auth0_ID", "memberName") VALUES ($1, $2) RETURNING "memberID"', [user_id, user_name], (err, res) => {
        if(err){
          console.log(err.stack);
        } else {
          console.log("New user added");
        }
      });
    } else {
      console.log("Found a match, repeat user.  No action");
    }
    return true;
  });
}

module.exports = checkUsers;
