"use strict"

var checkAuth = require('middleware/checkAuth');

exports = module.exports = function(app, passport) {

app.get('/', function (req, res) {
  res.redirect('/dashboard');
});

app.get('/dashboard', require('./views/dashboard/index').init);

app.get('/dashboard/login', require('./views/dashboard/login/index').init);
app.post('/dashboard/login', require('./views/dashboard/login/index').login);
app.post('/dashboard/logout', require('./views/dashboard/logout/index').logout);

app.get('/dashboard/developers', checkAuth, require('./views/dashboard/developers/index').init);
app.get('/dashboard/developers/:id', checkAuth, require('./views/dashboard/developers/index').getById);

app.post('/dashboard/developers', require('./views/dashboard/developers/index').save);
};
