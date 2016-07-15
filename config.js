"use strict"
exports.port = process.env.PORT || 4000;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test1'
};

exports.session = {
  secret: 'someSicretStringForDashboard',
  key: 'sid',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
};

exports.language = {
  default: 'en',
  support: ['en', 'ru'],
  cookiesVariable: 'locale'

};

