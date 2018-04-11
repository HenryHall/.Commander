
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const pool = require('./connection.js');

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || '/login/callback',
    scope: 'openid'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    //Why is this not working?  **Fix**
    // localStorage.setItem('authenticationToken', accessToken);
    return done(null, profile);
  }
);

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  pool.query('SELECT * FROM "members" WHERE "auth0_ID" = $1', [user.id], (err, results) => {
    if (err) {
      throw err
    } else {
      results.rows[0].id = user.id;
      // console.log("results", results);
      done(null, results.rows[0]);
    }
  });
});

module.exports = passport;
