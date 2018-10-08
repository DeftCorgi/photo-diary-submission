// middleware to ensure that the entry belongs to the user of the request
module.exports = (req, res, next) => {
  if (req.params.id in req.user.entries) return next();
  res.redirect('/');
};
