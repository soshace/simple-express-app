var config = require('./config');
var express = require('express');
var path = require('path');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var http = require('http');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
require('rootpath')();

// create express app
var app = express();

// keep reference to config
app.config = config;

// setup the web server
app.server = http.createServer(app);

// setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  // and... we have a data store
  console.log("We connect to mongodb");
});

app.set('error', __dirname + '/error');
// config data models
require('./models')(app, mongoose);

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.session.secret,
  key: config.session.key,
  cookie: config.session.cookie,
  store: new MongoStore({mongooseConnection: app.db}),
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(app, passport);
app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));
// app.use(require('./middleware/detectLang'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
  path: 'views',
  layoutPath: 'views/layouts',
  defaultLayout: 'main',
  partialsDir: 'views/partials',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');


// setup routes
require('./routes')(app);
app.use(require('error').handle);



//listen up
app.server.listen(app.config.port, function(){
  console.log('Server is running on port ' + config.port);
});

