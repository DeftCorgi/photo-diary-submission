const keys = require('../config/keys');
const Entry = require('../models/entry');
const User = require('../models/user');

// setup multipart form processing
const multer = require('multer');
const gcs = require('multer-sharp');
const storage = gcs({
  bucket: keys.gcsBucketName,
  projectId: keys.googleProjectId,
  keyFilename: './config/gcp.json',
  size: { width: 350, height: 350 }
});
const photoInput = multer({ storage });

module.exports = app => {
  // middleware to save user
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });

  app.get('/', async (req, res) => {
    // if user not logged then render landing
    if (req.user) return res.redirect('/home');
    res.render('landing');
  });

  app.get('/home', async (req, res) => {
    const userEntries = req.user.entries;
    let entries;
    entries = await Entry.get(userEntries)
      .then(e => (entries = [e.plain()]))
      .catch(err => (entries = []));

    console.log(entries);
    res.render('home', { entries });
    console.log({entries})
  });

  app.get('/entry/new', (req, res) => {
    res.render('new');
  });

  app.post('/entry/new', photoInput.single('photo'), async (req, res) => {
    const { title, description } = req.body;
    const photoUrl = req.file.path;
    const entry = await new Entry({ title, description, photoUrl });
    await entry.save();
    // get logged in user and their entries
    const user = await User.findOne({ id: req.user.id }).catch(err =>
      console.log('user not found')
    );
    // update the user object
    await User.update(user.entityKey.id, {
      entries: [entry.entityKey.id]
    }).catch(err => console.log(err));
    res.render('view', { entry });
    console.log(req.user.entries);
  });

  app.get('/entry/view/:id', async (req, res) => {
    const entry = await Entry.findOne({ id: req.params.id });
    res.render('view', { entry });
  });

  app.get('/entry/edit/:id', async (req, res) => {
    const entry = await Entry.findOne({ id: req.params.id });
    res.render('home');
  });

  app.patch('/entry/edit/:id', (req, res) => {
    res.render('home');
  });

  app.delete('/entry/:id', (req, res) => {
    res.render('home');
  });
};
