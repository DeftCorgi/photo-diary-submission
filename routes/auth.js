// auth routes
const passport = require('passport');

// passport strategys
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

// models
const keys = require('../config/keys');
const User = require('../models/user');

// serialize the user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize a user from the session
passport.deserializeUser(async (id, done) => {
  // ideally should find user from database with given id
  const user = await User.get(id);
  console.log(user);
  done(null, user);
});

// setup passport to use the google OAuth2 strategy
passport.use(
  new googleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName } = profile;
      const user = { id, displayName };
      const newUser = await new User(user);
      console.log(newUser);
      done(null, newUser);
    }
  )
);

module.exports = app => {
  // user authentication routes
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // callbacks
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      if (!req.user.finishedRegistration) {
        return res.redirect('/');
      }
      res.redirect('/');
    }
  );

  // logout the current user
  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // returns the current user object
  app.get('/auth/current', (req, res) => {
    //console.log('user: ' + req.user);
    res.send(req.user);
  });
};
