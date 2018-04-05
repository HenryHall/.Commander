
require('dotenv').config();
console.log("Hello from server.js");

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var server = express();

// ------------------------------------------------------------------ //

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');


const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/login/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    console.log("Here with:", profile);
    return done(null, profile);
  }
);

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


server.use(session({ secret: process.env.SESSION_SECRET }));
server.use(bodyParser.urlencoded({ extended: false }));

server.use(passport.initialize());
server.use(passport.session());

// ------------------------------------------------------------------ //

server.use( express.static( 'public' ) );

server.set('port', process.env.PORT || 3000);
server.listen(server.get('port'), function() {
  console.log('Server up:', server.get('port'));
});


server.get( '/', function( req, res ){
  console.log( 'Serving Home' );
  res.sendFile( path.resolve( 'public/views/index.html' ) );
});


var loginModule = require('../server/modules/login.js');
var logoutModule = require('../server/modules/logout.js');

server.use('/login', loginModule);
server.use('/logout', logoutModule);
server.use('/loginFailure', function(req, res){ res.sendFile( path.resolve( 'public/views/LoginFailure/loginFailure.html' ))});


// var myRoute = require ('../server/modules/route.js');
// server.use('/myRoute', myRoute);
