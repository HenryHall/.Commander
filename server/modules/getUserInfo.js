
const express = require('express');
const router = express.Router();

const pool = require('./connection.js');

const Auth = require('./checkAuthentication.js');
const checkNewUser = require('./checkNewUser.js');

// Should check for new user here
router.get('/', Auth.checkAuth, function(req, res){

  console.log("Getting user object");

  //Make db call for profile data
    var userObject = {
      memberID: undefined,
      memberName: undefined,
      joinDate: undefined,
      groups: [],
      deckLists: [],
      banlists: []
    };
    const userObjectQueries = {
      memberDetailsQuery: {
        text: 'Select "memberID", "memberName", "joinDate" FROM "members" WHERE "auth0_ID" = $1',
        values: [req.user.id]
        },
      groupDetailsQuery: {
        text: 'SELECT "g"."groupID", "g"."groupName", "mg"."joinDate", "mg"."role" FROM "groups" "g", "memberGroups" "mg", "members" "m" WHERE "g"."groupID" = "mg"."groupID" AND "mg"."memberID" = "m"."memberID" AND "m"."memberID" = $1',
        values: []
        },
      deckListQuery: {
        text: 'SELECT * FROM "memberDeckLists" WHERE "memberID" = $1',
        values: []
        },
      banlistsQuery: {
        text: 'SELECT * FROM "banlist" JOIN "memberBanlists" ON "memberBanlists"."banlistID" = "banlist"."banlistID" WHERE "memberBanlists"."memberID" = $1',
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
          console.log("result:", result);
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
              groupID: row.groupID,
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
      userObjectQueries.banlistsQuery.values = [memberID];
      pool.query(userObjectQueries.banlistsQuery, (err, results) => {
        if (err) {
          console.log("banlistsQuery failed.", err);
          res.sendStatus(418);
        } else {
          results.rows.forEach((row) => {
            userObject.banlists.push({
              banlistID: row.banlistID,
              banlistName: row.banlistName,
              creationDate: row.creationDate,
              isPublic: row.isPublic
            });
          });
          res.send(userObject);
        }
      });//End banlistQuery
    }


});//End router.get

module.exports = router;
