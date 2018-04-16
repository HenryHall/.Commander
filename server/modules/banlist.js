
const express = require('express');
const router = express.Router();

const authCheck = require('./checkAuthentication.js');

const pool = require('./connection.js');

//Get ban list by banlistID
router.get('/:banlistID', function(req, res){

  console.log("banlist.js: Looking for banlistID:", req.params.banlistID);

  var banlistObject = {
    bans: [],
    members: [],
    groups: [],
    banlistID: req.params.banlistID,
    banlistName: undefined,
    creationDate: undefined,
    isPublic: undefined
  };

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT "banlist"."isPublic", "banlist"."banlistName", "banlist"."creationDate", "members"."memberID", "members"."memberName", "memberBanlists"."addDate", "memberBanlists"."role" FROM "banlist" JOIN "memberBanlists" ON "memberBanlists"."banlistID" = "banlist"."banlistID" JOIN "members" ON "members"."memberID" = "memberBanlists"."memberID" WHERE "banlist"."banlistID" = $1', [req.params.banlistID], (err1, res1) => {
      if (err1) {
        console.log("banlist query failed.", err1);
        done();
        return res.sendStatus(418);
      }

      //No matches
      if(res1.rows.length <= 0) {
        done();
        return res.send(undefined);
      }

      var isMember = false;
      banlistObject.banlistName = res1.rows[0].banlistName;
      banlistObject.creationDate = res1.rows[0].creationDate;
      banlistObject.isPublic = res1.rows[0].isPublic;

      //Check is requester is a member of this banlist
      res1.rows.forEach((row) => {
        if(req.user && req.user.memberID == row.memberID) {isMember = true;}
        banlistObject.members.push({memberID: row.memberID, memberName: row.memberName, addDate: row.addDate, role: row.role});
      });

      //Not public or not a member of this banlist
      if(!banlistObject.isPublic && !isMember){
        console.log("Banlist is not public and user is not member.");
        done();
        return res.send(undefined);
      }

      client.query('SELECT "banlistBans".* FROM "banlistBans" JOIN "banlist" ON "banlist"."banlistID" = "banlistBans"."banlistID" WHERE "banlist"."banlistID" = $1', [req.params.banlistID], (err2, res2) => {
        console.log("Getting bans");
        if (err2) {
          console.log("banlist query failed.", err2);
          done();
          return res.sendStatus(418);
        }

        res2.rows.forEach( (row) => {
          banlistObject.bans.push({cardName: row.cardName, banDate: row.banDate});
        });

        client.query('SELECT "groupBanlists"."groupID", "groupBanlists"."addDate", "groups"."groupName", "groups"."isPublic" FROM "groupBanlists" JOIN "groups" ON "groups"."groupID" = "groupBanlists"."groupID" WHERE "groupBanlists"."banlistID" = $1', [req.params.banlistID], (err3, res3) =>{
          console.log("Getting Groups");
          done();
          if (err3) {
            console.log("banlist query failed.", err3);
            return res.sendStatus(418);
          }

          res3.rows.forEach( (row) => {
            if(row.isPublic){
              //This should check if the requester is a member of the group, to display if not public  **FIX**
              banlistObject.groups.push({groupID: row.groupID, addDate: row.addDate, groupName: row.groupName});
            }
          });
          return res.send(banlistObject);

        });

      });

    });
  });

});


//Post a new ban list
router.post('/new', authCheck, function(req, res){

  console.log("New ban list:", req.body);

  var newList = req.body;

  if(!newList){return res.sendStatus(418);}

  pool.connect((err, client, done) => {
    const shouldAbort = (err) => {
      if (err) {
        console.error('Error in transaction', err.stack)
        client.query('ROLLBACK', (err) => {
          if (err) {
            console.error('Error rolling back client', err.stack)
          }
          // release the client back to the pool
          done()
        });
      }
      return !!err;
    }

    client.query('BEGIN', (err) => {
      if (shouldAbort(err)) {return res.sendStatus(418);}

      client.query('INSERT INTO "banlist" ("banlistName", "isPublic") VALUES($1, $2) RETURNING "banlistID"', [newList.banlistName, newList.isPublic], (err1, res1) => {
        if (shouldAbort(err1)) {return res.sendStatus(418);}

        var banlistID = res1.rows[0].banlistID;

        client.query('INSERT INTO "memberBanlists" ("memberID", "banlistID", "role") VALUES($1, $2, $3)', [req.user.memberID, banlistID, "Creator"], (err2, res2) => {
          if (shouldAbort(err1)) {return res.sendStatus(418);}

          let queries = newList.bans.map((ban) => {
            return new Promise((resolve) => {
              client.query('INSERT INTO "banlistBans" ("banlistID", "cardName") VALUES($1, $2)', [banlistID, ban], (err3, res3) => {
                console.log("Insert ban");
                if (shouldAbort(err3)) {return res.sendStatus(418);}
                resolve();
              }); //End Insert 3
            });
          });

          Promise.all(queries).then(() => {
            client.query('COMMIT', (err4) => {
              console.log("Committing");
              done();
              if (err4) {
                console.error('Error committing transaction', err.stack);
                return res.sendStatus(418);
              }
              return res.send({banlistID: banlistID});
            }); //End Commit
          });

        }); //End Insert2

      }); //End Insert1

    });
  });

});


module.exports = router;
