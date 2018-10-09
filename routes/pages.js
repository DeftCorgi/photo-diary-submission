const keys = require('../config/keys');
const Entry = require('../models/entry');
const User = require('../models/user');

const belongsToUser = require('../middleware/belongsToUser');

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
    let entries = [];
    if (userEntries.length > 0) {
      await Entry.get(userEntries)
        .then(e => {
          if (e.length) {
            entries = e;
          } else {
            entries = [e];
          }
        })
        .catch(err => {
          console.log(err);
          entries = [];
        });
    }
    // console.log(entries);
    const plainEntries = entries.map(e => e.plain());
    res.render('home', { entries: plainEntries });
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
    const entries = [...user.entries, entry.entityKey.id];
    await User.update(user.entityKey.id, { entries }).catch(err =>
      console.log(err)
    );
    res.redirect('view/' + entry.entityKey.id);
  });

  app.get('/entry/view/:id', belongsToUser, async (req, res) => {
    let entry;
    entry = await Entry.get(req.params.id).catch(err => {
      console.log(err);
      console.log(req.params.id);
      return res.redirect('/');
    });
    res.render('view', { entry: entry.plain() });
  });

  app.get('/entry/edit/:id', belongsToUser, async (req, res) => {
    const entry = await Entry.get(req.params.id).catch(err => {
      console.log(err);
      console.log(req.params.id);
      return res.redirect('/');
    });
    res.render('edit', { entry: entry.plain() });
  });

  app.post('/entry/edit/:id', async (req, res) => {
    const { title, description } = req.body;
    console.log(req.body);
    await Entry.update(req.params.id, { title, description }).catch(err =>
      console.log(err)
    );
    res.redirect('/entry/view/' + req.params.id);
  });

  // delete an entry
  app.get('/entry/delete/:id', belongsToUser, async (req, res) => {
    await Entry.delete(req.params.id);
    const user = await User.findOne({ id: req.user.id });
    const entries = user.entries.filter(e => e.id != req.params.id);
    await User.update(user.entityKey.id, { entries });
    res.redirect('/');
  });
};
