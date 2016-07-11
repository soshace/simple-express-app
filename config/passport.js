var LocalStrategy = require("passport-local").Strategy;

module.exports = function(app, passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    var User = app.db.models.User;
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, userName, password, done) {
    var User = req.app.db.models.User;
    User.authorize(userName, password, function(err, user) {
      if (err) {
        if ( err instanceof AuthError) {
          return done(new HttpError(403, err.message));
        } else {
          return done(err);
        }
      }

      return done(null, user);

    });
  }));

  app.passport = passport;
};







