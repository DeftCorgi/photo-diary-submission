const express = require('express');
const expressLayout = require('express-ejs-layouts');

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(expressLayout);

// routes
require('./routes/pages')(app);

port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Now listening to port ${port}`));
