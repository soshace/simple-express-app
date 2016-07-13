var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
  if (!req.user) {
    return next(new HttpError(401, "You are not authorize"));
  }
  next();
};