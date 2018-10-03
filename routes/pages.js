const Entry = require('../models/entry');
const User = require('../models/user');

module.exports = app => {
  app.get('/', async (req, res) => {
    const entries = await Entry.get([1]).catch(err => {});
    res.render('index', { entries });
  });

  app.get('/entry/new', (req, res) => {
    res.render('home');
  });

  app.get('/entry/view/:id', async (req, res) => {
    const entry = await Entry.findOne({ id: req.params.id });
    res.render('home', { entry });
  });

  app.get('/entry/edit/:id', async (req, res) => {
    const entry = await Entry.findOne({ id: req.params.id });
    res.render('home');
  });

  app.patch('/entry/edit/:id', (req, res) => {
    res.render('home');
  });

  app.post('/entry/new', (req, res) => {
    res.render('home');
  });

  app.delete('/entry/:id', (req, res) => {
    res.render('home');
  });
};
