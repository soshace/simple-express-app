module.exports = function(req, res, next) {
  if (!req.session.user) return next();

  var User = req.app.db.models.User;
  User.findById(req.session.user, function(err, user) {
    if (err) return next(err);

    req.user = user;
    next();
  });
};
