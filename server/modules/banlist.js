
const express = require('express');
const router = express.Router();

const authCheck = require('./checkAuthentication.js');

const pool = require('./connection.js');

//Get ban list dashboard
router.get('/', function(req, res){

  var userBanlist = undefined;

  //If not logged in, no data to return
  if(!req.user){ return res.send(userBanlist); }

  userBanlist = {
    memberID: req.user.memberID,
    memberName: req.user.memberName,
    banlist: {}
  };


  // pool.connect((err, client, done) => {
  //   if (err) throw err;
    pool.query('SELECT * FROM "banlist" JOIN "memberBanlists" ON "memberBanlists"."banlistID" = "banlist"."banlistID" JOIN "banlistBans" ON "banlistBans"."banlistID" = "banlist"."banlistID" WHERE "memberBanlists"."memberID" = $1', [req.user.memberID], (select1Err, select1Res) => {
      if (select1Err) {
        //Please handle better
        console.log(select1Err.stack);
        return res.sendStatus(400);
      } else {
        select1Res.rows.forEach( (row) => {
          console.log("Next:", userBanlist.banlist);
          console.log("Row:", row);
          // var banlistName = row.banlistName.replace(/\s/g, '&nbsp;');
          var banlistName = row.banlistName;

          if(row.banlistName in userBanlist.banlist){
            userBanlist.banlist[banlistName].creationDate = row.banlistName;
            userBanlist.banlist[banlistName].isPublic = row.isPublic;
            userBanlist.banlist[banlistName].bans.push({cardName: row.cardName, banDate: row.banDate});
          } else {
            console.log("New:", banlistName);
            userBanlist.banlist[banlistName] = {
              bans: []
            };
          }
        });

        return res.send({userBanlist});

      }

    }); //End select1

  // });


});

//Get specific ban list by banListID
router.get('/:banListID', function(req, res){
  console.log("Ban list ID:", req.params.banListID);

  var banListID = req.params.banListID;

});

//Post a new ban list
router.post('/newDeckList', function(req, res){});


module.exports = router;
