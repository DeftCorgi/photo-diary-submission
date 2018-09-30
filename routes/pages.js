module.exports = app => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/home', (req, res) => {
    res.render('home');
  });
};
