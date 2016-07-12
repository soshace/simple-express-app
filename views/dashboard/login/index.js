'use strict';

exports.init = function(req, res, next){
  res.render('./dashboard/login/index', {
    layout: 'dashboard',
    title: 'Login',
  });
};

exports.login = function(req, res, next){
  console.log("req.user: " + req.user);
  res.redirect('/dashboard/developers');
  // var User = req.app.db.models.User;
  // var username = req.body.username;
  // var password = req.body.password;

  // User.authorize(username, password, function(err, user) {
  //   if (err) {
  //     if (err instanceof AuthError) {
  //       return next(new HttpError(403, err.message));
  //     } else {
  //       return next(err);
  //     }
  //   }

  //   req.session.user = user.id;
  //   res.redirect('/dashboard/login/');
  // });
};
