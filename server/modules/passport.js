
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');


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
  done(null, user);
});

module.exports = passport;
