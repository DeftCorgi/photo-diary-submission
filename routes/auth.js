// auth routes
const passport = require('passport');

// passport strategys
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

// models
const keys = require('../config/keys');

// serialize the user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize a user from the session
passport.deserializeUser(async (id, done) => {
  // ideally should find user from database with given id
  const user = await Users.findById(id);
  done(null, user);
});

// setup passport to use the google OAuth2 strategy
passport.use(
  new googleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, emails, displayName, language } = profile;

      // search for existing user here
      const existingUser = await GoogleUsers.findOne({
        where: { googleId: id }
      });

      if (existingUser) {
        console.log(
          `existing user found: ${existingUser.googleId} ${existingUser.userId}`
        );
        const user = await Users.findById(existingUser.userId);
        return done(null, user);
      }

      // build a generic User object
      const user = Users.build({
        email: emails[0].value,
        displayName,
        language: language || 'en',
        dob: new Date()
      });

      await user.save();

      // associate googleUser object with bew generic user object
      const googleUser = GoogleUsers.build({
        googleId: id,
        userId: user.id
      });

      // persist to DB
      await googleUser.save();

      // if no existing user, create new user here
      console.log('new user created id:' + googleUser.googleId, ', ' + user.id);
      return done(null, user);
    }
  )
);

module.exports = app => {
  // user authentication routes
  app.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // callbacks
  app.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      if (!req.user.finishedRegistration) {
        return res.redirect('/');
      }
      res.redirect('/');
    }
  );

  // logout the current user
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // returns the current user object
  app.get('/current', (req, res) => {
    //console.log('user: ' + req.user);
    res.send(req.user);
  });
};
