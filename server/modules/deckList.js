
const express = require('express');
const router = express.Router();

const authCheck = require('./checkAuthentication.js');

const pool = require('./connection.js');

router.get('/d/:deckListID', function(req, res){

  console.log("Deck list ID:", req.params.deckListID);

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT * FROM "memberDeckLists" WHERE deckListID = $1', [req.params.deckListID], (selectError, selectResult) => {
      done();
      if (selectError) {
        //Please handle better
        console.log(selectError.stack);
        res.sendStatus(400);
      } else {
        console.log(selectResult.rows[0]);
        //Return info if deck list is public or owned by requester
        if(selectResult.rows[0].isPublic  || req.memberID == selectResult.rows[0].memberID){
          //Success
          res.send({deckInfo: selectResult.rows[0]});
        }

        //Not public or owned by requester
        res.sendStatus(204);
      }
    });
  });
});

router.post('/newList', authCheck, function(req, res){

  var newList = req.body;

  if(!newList){res.sendStatus(418);}

  console.log(newList);

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT "memberID" FROM members WHERE "auth0_ID" = $1', [req.user.id], (selectError, selectResult) => {
      if (selectError) {
        //Please handle better
        console.log(selectError.stack);
      } else {
        console.log(selectResult.rows[0]);
        var memberID = selectResult.rows[0].memberID;

        client.query('INSERT INTO "memberDeckLists" ("memberID", "deckName", "deckListLink", "isPublic", "commander") VALUES($1, $2, $3, $4, $5) RETURNING "deckListID"', [memberID, newList.deckNameIn, newList.deckLinkIn, newList.isPublicIn, newList.commanderIn], (insertError, insertResult) => {
          done();
          if (insertError) {
            //Please handle better
            console.log(insertError.stack);
          } else {
            var deckListID = insertResult.rows[0].deckListID;
            console.log("New deck list created:", insertResult.rows[0].deckListID);
            res.send({deckListID: deckListID});
          }
        }); //End INSERT statement

      }
    }); //End memberID query
  }); //End pool connect

}); //End /newList

module.exports = router;
