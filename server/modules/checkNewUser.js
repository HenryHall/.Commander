
const pool = require('./connection.js');

var checkUsers = function(req, res, next){
  console.log("Checking users");

  if(!req.user){
    throw new Error('No user object.');
    return next(false);
  }

  var user_id = req.user.id;
  var memberName = req.user._json['https://magicmaker:auth0:com/userinfo/user_metadata'].memberName;


  pool.query('SELECT * FROM members WHERE "auth0_ID" = $1', [user_id], (err, result) => {
    if(err){
      console.log(err.stack);
    } else if (result.rowCount == 0){
      //New user, add to db
      pool.query('INSERT INTO members("auth0_ID", "memberName") VALUES ($1, $2) RETURNING "memberID"', [user_id, memberName], (err, res) => {
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
