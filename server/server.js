
require('dotenv').config();
console.log("Hello from server.js");

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var server = express();

var passport = require('../server/modules/passport.js');

server.use(session({ secret: process.env.SESSION_SECRET }));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json())

server.use(passport.initialize());
server.use(passport.session());

server.use( express.static( 'public' ) );

server.set('port', process.env.PORT || 3000);
server.listen(server.get('port'), function() {
  console.log('Server up:', server.get('port'));
});


server.get( '/', function( req, res ){
  console.log( 'Serving Home' );
  res.sendFile( path.resolve( 'public/views/index.html' ) );
});


server.get('/login', function(req, res, next){
  console.log(req.header('Referer'));
  req.session.backURL = req.header('Referer') || '/';
  console.log("backURL:", req.session.backURL);
  next();
}, passport.authenticate('auth0', {}), function(req, res){
  res.redirect('/');
});

server.get('/login/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/loginFailure'
  }),
  function(req, res) {
    const checkNewUser = require('../server/modules/checkNewUser');
    console.log("Successful login:", req.user.id);
    checkNewUser(req, res, function(isNewUser){
      console.log("isNewUser:", isNewUser);
      if(isNewUser){
        console.log("req.user", req.user);
        req.user.isNewUser = true;
        res.redirect("/#/profile");
      } else {
        res.redirect(req.session.backURL || '/');
      }
    });
  }
);

// var loginModule = require('../server/modules/login.js');
var logoutModule = require('../server/modules/logout.js');
var getUserInfoModule = require('../server/modules/getUserInfo.js');
var deckListModule = require('../server/modules/deckList.js');

// server.use('/login', loginModule);
server.use('/logout', logoutModule);
server.use('/getUserInfo', getUserInfoModule);
server.use('/d', deckListModule);
server.use('/loginFailure', function(req, res){ res.sendFile( path.resolve( 'public/views/LoginFailure/loginFailure.html' ))});
