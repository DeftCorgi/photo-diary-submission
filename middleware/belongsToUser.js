// middleware to ensure that the entry belongs to the user of the request
module.exports = (req, res, next) => {
  if (req.user.entries.includes(req.params.id)) return next();
  res.redirect('/');
};
