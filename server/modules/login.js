
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
    //Probably want to change this to indicate to the user that login failed **FIX**
    // failureRedirect: '/'
    failureRedirect: '/loginFailure'
  }),
  function(req, res) {
    // res.redirect(req.session.returnTo || '/user');
    console.log(req.user);
    checkNewUser(req.user.id);

    res.redirect('/');
  }
);



module.exports = router;
//End
