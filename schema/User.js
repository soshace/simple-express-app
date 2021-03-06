'use strict';
var util = require('util');
var async = require('async');

var crypto = require('crypto');

var AuthError = require('error').AuthError;

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
    salt: {
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

  userSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
  };

  userSchema.statics.authorize = function(username, password, callback) {
    var User = this;

    async.waterfall([
      function(callback) {
        User.findOne({userName: username}, callback);
      },
      function(user, callback) {
        if (user) {
          if (user.checkPassword(password)) {
            callback(null, user);
          } else {
            callback(new AuthError("Password Error"));
          }
        } else {
          callback(new AuthError("User not found"));
        }
      }

    ], callback);
  };

  app.db.model('User', userSchema);
};

