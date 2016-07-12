module.exports = function(req, res, next) {
  /* This middleware add user object in every view if user is login */

  if (req.user) {
    res.locals.user = req.user;
  }
  next();

};
