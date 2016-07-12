var path = require('path');
var util = require('util');
var http = require('http');

exports.handle = function(err, req, res, next) {
  if (typeof err == 'number') {
    err = new HttpError(err);
  }

  if (err instanceof HttpError || err instanceof AuthError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
};

// Errors for visitors
function HttpError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, HttpError);

  this.status = status;
  this.message = message || http.STATUS_CODES[status] || "Error";
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

exports.HttpError = HttpError;

function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
