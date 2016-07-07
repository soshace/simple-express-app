var config = require('./config');
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');


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

// config data models
require('./models')(app, mongoose);

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('.hbs', exphbs({
  path: 'views',
  layoutPath: 'views/layouts',
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// setup routes
require('./routes')(app);

//listen up
app.server.listen(app.config.port, function(){
  //and... we're live
  console.log('Server is running on port ' + config.port);
});

