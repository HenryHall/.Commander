
const pool = require('./connection.js');

var checkUsers = function(req, res, next){
  console.log("Checking users");

  if(!req.user){
    //Handle no session data  **FIX**
    return next(false);
  }

  var user_id = req.user.id;

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
      req.user.memberID = result.rows[0].memberID;
      console.log("Found a match, repeat user. memberID:", req.user.memberID);
    }
    return next(true);
  });
}

module.exports = checkUsers;
