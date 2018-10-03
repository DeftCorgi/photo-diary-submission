module.exports = app => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/entry/new', (req, res) => {
    res.render('home');
  });

  app.get('/entry/view/:id', (req, res) => {
    res.render('home');
  });

  app.get('/entry/edit/:id', (req, res) => {
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
