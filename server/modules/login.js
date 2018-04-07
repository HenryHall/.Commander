
const express = require('express');
const router = express.Router();
const passport = require('./passport.js');

const checkNewUser = require('./checkNewUser');

router.get('/',
  // function(req, res){
  //   //Set return url
  //   req.session.backURL = req.header('Referer') || '/';
  //   console.log("backURL:", req.session.backURL);
  // },
  passport.authenticate('auth0', {
    // clientID: process.env.AUTH0_CLIENT_ID,
    // domain: process.env.AUTH_DOMAIN,
    // redirectUri: process.env.AUTH0AUTH0_CALLBACK_URL,
    // audience: 'https://' + process.env.AUTH0_DOMAIN + '/userinfo',
    // responseType: 'code',
    // scope: 'openid'
  }),
  function(req, res){
    //Set return url
    req.session.backURL = req.header('Referer') || '/';
    console.log("backURL:", req.session.backURL);
    res.redirect(req.session.backURL || '/loginFailure');
  }
);


router.get(
  '/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/loginFailure'
  }),
  function(req, res) {
    console.log("Successful login:", req.user.id);
    checkNewUser(req.user.id, function(isNewUser){
      console.log("isNewUser:", isNewUser);
      if(isNewUser){
        req.user.isNewUser = true;
        res.redirect('/profile');
      } else {
        res.render('/', {user: req.user});
      }
    });
  }
);



module.exports = router;
//End
