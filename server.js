const express = require('express');
const gstore = require('gstore-node')();
const Datastore = require('@google-cloud/datastore');
const passport = require('passport');
const keys = require('./config/keys');

// connect datastore with model package
const datastore = new Datastore({
  projectId: keys.googleProjectId
});

gstore.connect(datastore);

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
require('./routes/auth')(app);
require('./routes/pages')(app);

port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Now listening to port ${port}`));
