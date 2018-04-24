
const express = require('express');
const router = express.Router();

const Auth = require('./checkAuthentication.js');

const pool = require('./connection.js');

router.get('/:deckListID', function(req, res){

  console.log("Deck list ID:", req.params.deckListID);

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT * FROM "memberDeckLists" WHERE "deckListID" = $1', [req.params.deckListID], (selectError, selectResult) => {
      if (selectError) {
        //Please handle better
        console.log(selectError.stack);
        return res.sendStatus(400);
      } else {

        //No results
        if(selectResult.rows.length <= 0){
          done();
          return res.send(undefined);
        }

        //Return info if deck list is public or owned by requester
        if(!selectResult.rows[0].isPublic && req.user.memberID != selectResult.rows[0].memberID){
          //Not public or owned by requester
          return res.sendStatus(204);
        } else {
          //Success
          var deckInfo = selectResult.rows[0];

          //Get memberName
          client.query('SELECT "memberName" FROM "members" WHERE "memberID" = $1', [selectResult.rows[0].memberID], (select2Error, select2Result) => {
            done();
            if(select2Error){
              console.log(select2Error.stack);
              return res.sendStatus(400);
            } else {
              console.log("memberName:", select2Result.rows[0].memberName);
              deckInfo.memberName = select2Result.rows[0].memberName;
              return res.send(deckInfo);
            }
          });
        }
      }
    });
  });
});

router.post('/New', Auth.authProtect, function(req, res){

  console.log("New deck list");

  var newList = req.body;

  if(!newList){return res.sendStatus(418);}

  pool.query('INSERT INTO "memberDeckLists" ("memberID", "deckName", "deckListLink", "isPublic", "commander") VALUES($1, $2, $3, $4, $5) RETURNING "deckListID"', [req.user.memberID, newList.deckNameIn, newList.deckLinkIn, newList.isPublicIn, newList.commanderIn], (insertError, insertResult) => {
    if (insertError) {
      //Please handle better
      console.log(insertError.stack);
      return res.sendStatus(400);
    } else {
      var deckListID = insertResult.rows[0].deckListID;
      console.log("New deck list created:", insertResult.rows[0].deckListID);
      return res.send({deckListID: deckListID});
    }
  }); //End INSERT statement

}); //End /newList

module.exports = router;
