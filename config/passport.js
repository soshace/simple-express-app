var LocalStrategy = require("passport-local").Strategy;

module.exports = function(app, passport) {

  var User = app.db.models.User;

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy(function(username, password, done) {
      User.authorize(username, password, function(err, user) {
        if (err) {
          return done(null, false, {message: err.message});
        }
        return done(null, user);
      });
    }
  ));
};
