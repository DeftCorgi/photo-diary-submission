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
  app.get('/', async (req, res) => {
    let partial = 'index';

    // iser user not logged then render landing
    if (!req.user) partial = 'landing';
    res.render(partial, { user: req.user });
  });

  app.get('/home', async (req, res) => {
    const userEntries = req.user.entries;
    const entries = await Entry.get(userEntries).catch(err => {});
    res.render('home', { layout: 'layout' });
  });

  app.get('/entry/new', (req, res) => {
    res.render('home', { layout: 'layout' });
  });

  app.post('/entry/new', photoInput.single('photo'), (req, res) => {
    const { title, description } = req.body;
    const newEntry = new Entry({ title, description });
    res.render('home');
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
