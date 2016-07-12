var LocalStrategy = require("passport-local").Strategy;

module.exports = function(app, passport) {

  var User = app.db.models.User;

  passport.serializeUser(function(user, done) {
    console.log("Print use id: " + user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.authorize(username, password, done);

      // User.findOne({ userName: username }, function (err, user) {
      //   console.log("We find one user in localStategy: " + user);
      //   if (err) { return done(err); }
      //   if (!user) {
      //     return done(null, false, { message: 'Incorrect username.' });
      //   }
      //   if (!user.checkPassword(password)) {
      //     return done(null, false, { message: 'Incorrect password.' });
      //   }
      //   return done(null, user);
      // });
    }
  ));
};







