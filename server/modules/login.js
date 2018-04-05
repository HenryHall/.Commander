
const express = require('express');
const router = express.Router();
const passport = require('passport');

const checkNewUser = require('./checkNewUser');

router.get('/', passport.authenticate('auth0', {
    clientID: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH_DOMAIN,
    redirectUri: process.env.AUTH0AUTH0_CALLBACK_URL,
    audience: 'https://' + process.env.AUTH0_DOMAIN + '/userinfo',
    responseType: 'code',
    scope: 'openid'
  }),
  function(req, res){
    res.redirect('/');
  }
);


router.get(
  '/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/loginFailure'
  }),
  function(req, res) {
    console.log("Successful login:", req.user.id);
    var isNewUser = checkNewUser(req.user.id);

    if(isNewUser){
      req.user.isNewUser = true;
      res.redirect('/profile', {user: req.user})
    } else {
      res.redirect('/', {user: req.user});
    }

  }
);



module.exports = router;
//End
