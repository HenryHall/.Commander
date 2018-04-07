
const express = require('express');
const router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: require('./connection.js')
});

router.get('/', function(req, res){

  //Make auth check  **FIX**

  //Make db call for profile data
    //Instead of declaring new object, copy the current req.user.userObject  **FIX**
    var userObject = {
      memberID: undefined,
      memberName: undefined,
      joinDate: undefined,
      groups: [],
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
          userObject.memberID = result.memberID;
          userObject.memberName = result.memberName;
          userObject.joinDate = result.joinDate;

          getGroupDetails(result.memberID);
        }
      });
    }

    //Kicks off getBanLists
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
          // res.send(userObject);
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
