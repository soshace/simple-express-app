"use strict"

exports = module.exports = function(app, passport) {

// Generic error handler used by all enpoints
function handleError(res, reason, message, code) {
  console.log('Error: ' + reason);
  res.status(code || 500).json({'error': message});
}

app.get('/', function (req, res) {
    // res.render('home', {cat: catMen.name});
  res.redirect('/dashboard');
});

app.get('/dashboard', require('./views/dashboard/index').init);

app.get('/dashboard/login', require('./views/dashboard/login/index').init);
app.post('/dashboard/login', require('./views/dashboard/login/index').login);

app.get('/dashboard/developers', require('./views/dashboard/developers/index').init);
app.get('/dashboard/developers/:id', require('./views/dashboard/developers/index').getById);

app.post('/dashboard/developers', require('./views/dashboard/developers/index').save);
  // //front end
  // app.get('/', require('./views/index').init);
  // app.get('/about/', require('./views/about/index').init);
  // app.get('/contact/', require('./views/contact/index').init);
  // app.post('/contact/', require('./views/contact/index').sendMessage);

  // //sign up
  // app.get('/signup/', require('./views/signup/index').init);
  // app.post('/signup/', require('./views/signup/index').signup);
};
