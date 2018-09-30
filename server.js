const express = require('express');
const gstore = require('gstore-node')();
const Datastore = require('@google-cloud/datastore');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');

const app = express();

// middleware
// configure cookie settings
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

// connect datastore with model package
const datastore = new Datastore({
  projectId: keys.googleProjectId,
  keyFilename: './config/gcp.json'
});
gstore.connect(datastore);

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
require('./routes/auth')(app);
require('./routes/pages')(app);

port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Now listening to port ${port}`));
