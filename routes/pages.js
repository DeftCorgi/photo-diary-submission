module.exports = app => {
  app.get('landing', (req, res) => {
    res.send('landing');
  });

  app.get('*', (req, res) => {
    res.send('hello world');
  });
};
