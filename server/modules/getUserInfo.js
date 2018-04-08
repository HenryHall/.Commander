
const express = require('express');
const router = express.Router();

const pool = require('./connection.js');

const authCheck = require('./checkAuthentication.js');
const checkNewUser = require('../server/modules/checkNewUser');

router.get('/', authCheck, checkNewUser, function(req, res){

  console.log("Getting user object");

  //Make db call for profile data
    //Instead of declaring new object, copy the current req.user.userObject  **FIX**
    var userObject = {
      memberID: undefined,
      memberName: undefined,
      joinDate: undefined,
      groups: [],
      deckLists: [],
      banLists: []
    };
    const userObjectQueries = {
      memberDetailsQuery: {
        text: 'Select "memberID", "memberName", "joinDate" FROM "members" WHERE "auth0_ID" = $1',
        values: [req.user.id]
        },
      groupDetailsQuery: {
        text: 'SELECT "g"."groupName", "mg"."joinDate", "mg"."role" FROM "groups" "g", "memberGroups" "mg", "members" "m" WHERE "g"."groupID" = "mg"."groupID" AND "mg"."memberID" = "m"."memberID" AND "m"."memberID" = $1',
        values: []
        },
      deckListQuery: {
        text: 'SELECT * FROM "memberDeckLists" WHERE "memberID" = $1',
        values: []
        },
      banListsQuery: {
        text: 'SELECT * FROM "banlist" WHERE "memberID" = $1',
        values: []
        }
    };

    //Kicks off getGroupDetails which kicks off getBanLists
    getMemberDetails();

    function getMemberDetails(){
      // Get member details
      console.log("Getting member details");
      pool.query(userObjectQueries.memberDetailsQuery, (err, results) => {
        if (err) {
          console.log("memberDetailsQuery failed.", err);
          res.sendStatus(418);
        } else {
          var result = results.rows[0];
          //Attach memberID to server userObject
          req.memberID = result.memberID;

          userObject.memberID = result.memberID;
          userObject.memberName = result.memberName;
          userObject.joinDate = result.joinDate;

          getGroupDetails(result.memberID);
        }
      });
    }

    //Kicks off getDeckLists
    function getGroupDetails(memberID){
      // Get group details
      console.log("Getting group details");
      userObjectQueries.groupDetailsQuery.values = [memberID];
      pool.query(userObjectQueries.groupDetailsQuery, (err, results) => {
        if (err) {
          console.log("groupDetailsQuery failed.", err);
          res.sendStatus(418);
        } else {
          results.rows.forEach((row) => {
            userObject.groups.push({
              groupName: row.groupName,
              joinDate: row.joinDate,
              role: row.role
            });
          });
          getDeckList(memberID);
        }
      });
    }


    //Kicks off getBanLists
    function getDeckList(memberID){
      // Get group details
      console.log("Getting group details");
      userObjectQueries.deckListQuery.values = [memberID];
      pool.query(userObjectQueries.deckListQuery, (err, results) => {
        if (err) {
          console.log("deckListQuery failed.", err);
          res.sendStatus(418);
        } else {
          results.rows.forEach((row) => {
            userObject.deckLists.push({
              deckListID: row.deckListID,
              deckName: row.deckName,
              deckListLink: row.deckListLink,
              isPublic: row.isPublic,
              commander: row.commander,
              playCount: row.playCount,
              addDate: row.addDate
            });
          });
          getBanLists(memberID);
        }
      });
    }


    //res.send built userObject
    function getBanLists(memberID){
      //Get ban list details
      console.log("Getting ban lists");
      userObjectQueries.banListsQuery.values = [memberID];
      pool.query(userObjectQueries.banListsQuery, (err, results) => {
        if (err) {
          console.log("banListsQuery failed.", err);
          res.sendStatus(418);
        } else {
          results.rows.forEach((row) => {
            userObject.banLists.push({
              banlistID: row.banlistID,
              banlistName: row.banlistName,
              creationDate: row.creationDate,
              isPublic: row.isPublic
            });
          });
          res.send(userObject);
        }
      });//End banListsQuery
    }


});//End router.get

module.exports = router;
