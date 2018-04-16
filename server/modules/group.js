

const express = require('express');
const router = express.Router();

const authCheck = require('./checkAuthentication.js');

const pool = require('./connection.js');


router.get("/:groupID", function(req, res){

  console.log("Looking for group", req.params.groupID);

  var groupID = req.params.groupID;

  var groupObject = {
    groupID: groupID,
    groupName: undefined,
    addDate: undefined,
    isPublic: undefined,
    banlists: [],
    members: []
  };

  pool.connect((err, client, done) => {
    if (err) throw err;

    //Get group info
    client.query('SELECT * FROM "groups" WHERE "groupID" = $1', [groupID], (selectError, selectResult) => {
      if (selectError) {
        //Please handle better
        console.log(selectError.stack);
        done();
        return res.send(undefined);
      } else if (selectResult.rows.length <= 0) {
        //Group does not exist
        console.log("No group found.");
        done();
        return res.send(undefined);
      } else {
        var group = selectResult.rows[0];
        groupObject.groupName = group.groupName;
        groupObject.addDate = group.addDate;
        groupObject.isPublic = group.isPublic;

        //Get members
        client.query('SELECT "members"."memberID", "members"."memberName", "memberGroups"."joinDate", "memberGroups"."role" FROM "members" JOIN "memberGroups" ON "memberGroups"."memberID" = "members"."memberID" WHERE "groupID" = $1', [groupID], (select2Error, select2Result) => {
          if (select2Error) {
            //Please handle better
            console.log(select2Error.stack);
            done();
            return res.sendStatus(400);
          } else {
            //Is the requester a group member?
            var isGroupMember = false;
            select2Result.rows.forEach( (row) => {
              groupObject.members.push({
                memberID: row.memberID,
                memberName: row.memberName,
                joinDate: row.joinDate,
                role: row.role
              });

              //Yes
              if(req.user && row.memberID == req.user.memberID){ isGroupMember = true; }
            });
            //Check if the group is public and if the requester is a member
            if(!group.isPublic && isGroupMember){
              done();
              return res.sendStatus(400);
            }

            //Get group ban lists
            client.query('SELECT * FROM "banlist" JOIN "groupBanlists" ON "banlist"."banlistID" = "groupBanlists"."banlistID" WHERE "groupBanlists"."groupID" = $1', [groupID], (select3Error, select3Results) => {
              done();
              if (select3Error) {
                //Please handle better
                console.log(select3Error.stack);
                return res.sendStatus(400);
              } else {
                // console.log("select3Results:", select3Results.rows);
                select3Results.rows.forEach( (row) => {
                  console.log("row:", row);
                  groupObject.banlists.push({
                    banlistID: row.banlistID,
                    banlistName: row.banlistName,
                    creationDate: row.creationDate,
                    addedDate: row.addedDate
                  });
                });

                console.log("groupObject:", groupObject);
                return res.send(groupObject);

              } //End select3 no err
            }); //End select3

          } //End select2 no err
        }); //End select2

      } //End select1 no err
    }); //End select1

  }); //End pool.connect

}); //End router.get


module.exports = router;
