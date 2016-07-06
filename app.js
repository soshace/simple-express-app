var express = require('express');
var exphbs  = require('express-handlebars');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');


//create express app
var app = express();

//keep reference to config
// app.config = config;

//setup the web server
// app.server = http.createServer(app);

var app = express();

//setup mongoose
app.db = mongoose.createConnection('mongodb://localhost/test1');
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  //and... we have a data store
  console.log("We connect to mongodb");
});

//config data models
require('./models')(app, mongoose);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.get('/', function (req, res) {
    res.render('home', {cat: catMen.name});
});

app.get('/dashboard', function (req, res) {
  Kitten.findOne({ form: "sam_id" }, function(err, cat) {
    res.render('dashboard', {cat: cat.name});
  });
});


app.get('/mongoose', function (req, res) {
    mongoose.model('Kitten').find(function(err, cats) {
      // res.render('dashboard', {cat: cats});
      res.send(cats);
    });
});

app.post('/dashboard', function (req, res) {
    console.log("we reseive post dashboard request, cat name: " + req.body.catName);
    Kitten.findOneAndUpdate({ form: "sam_id" }, {$set: {name: req.body.catName}}, {upsert:true}, function() {
      res.redirect('/dashboard');
    });
});

app.listen(3000);
