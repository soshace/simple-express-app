'use strict';

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

  app.db.model('User', userSchema);
};
