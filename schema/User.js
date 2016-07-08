'use strict';
var util = require('util');
var async = require('async');

var crypto = require('crypto');

exports = module.exports = function(app, mongoose) {
  var userSchema = new mongoose.Schema({
    userName: {
      type: String,
      unique: true,
      required: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    }
  });

  userSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  };

  userSchema.virtual('password')
    .set(function(password) {
      this._plainPassword = password;
      this.salt = Math.random() + '';
      this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

  userSchema.statics.authorize = function(username, password, callback) {
    var User = this;

    async.waterfall([
      function(callback) {
        User.findOne({userName: username}, callback);
      },
      function(user, callback) {
        if (user) {
          console.log("User found");
          if (user.checkPassword(password)) {
            callback(null, user);
          } else {
            // next(new HttpError(403, "Password Error"));
            callback(err);
          }
        } else {
          console.log("User not found");
          var user = new User({userName: username, password: password});
          console.log("user: " + user);
          user.save(function(err) {
            console.log("Try to save user");
            if (err) { 
              console.log(err);
              return callback(err);
            }
            callback(null, user);
          });
        }
      }

    ], callback);
  };

  app.db.model('User', userSchema);
};

function AuthError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this. message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
