'use strict';
var async = require('async');
exports.init = function(req, res, next){
  res.render('./dashboard/login/index', {layout: 'dashboard', user: req.user});
};

exports.login = function(req, res, next){
  var User = req.app.db.models.User;
  // res.render('./dashboard/login/index', {layout: 'dashboard'});
  var username = req.body.username;
  var password = req.body.password;

  User.authorize(username, password, function(err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
        return next(err);
      }
    }

    req.session.user = user.id;
    res.redirect('/dashboard/login/');
  });
};
