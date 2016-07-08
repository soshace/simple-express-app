'use strict';

var HttpError = require('error').HttpError;

exports.init = function(req, res){
  // res.render('developers/index');

  req.app.db.models.Developer.find({}, function(err, developers) {
    if (err) return next(err);
    res.render('./dashboard/developers/index', {layout: 'dashboard', developers: developers});
    // res.json(developers);
    // req.app.db.models.Developer.findOne({}, function(err, developers) {
    // req.app.db.models.Translation.findById(developers.name, function(err, name) {
    //   console.log(name.translation[0].text);
    // });
    // console.log(developers);
    // // console.log(developers.name.translation);
    // if (err) {
    //   handleError(res, err.message, "Failed to get Developers.");
    // } else {
    //   // res.status(200).json(docs);
    // }
  });
};

function translateField(field, lang) {
  return field.find(function(element) {
    return element.language === lang;
  }).text;
}

exports.getById = function(req, res, next){
  req.app.db.models.Developer.findById(req.params.id).populate('name').populate('position').populate('info').exec(function(err, developer) {
    if (err) return next(err);
    console.log(developer);
    if (!developer) {
      return next(new HttpError(404, "User not found"));
    }
    var lang = 'en';
    var developer_info = {};
    developer_info.name = translateField(developer.name.translation, lang);
    developer_info.position = translateField(developer.position.translation, lang);
    developer_info.info =  translateField(developer.info.translation, lang);
    res.json(developer_info);
  });
};

exports.save = function(req, res){
  var db = req.app.db;
  console.log(db.models);
  var Developer = db.model('Developer');

  var Translation = db.model('Translation');
  var name = new Translation();
  name.name = 'name';
  name.translation.push({language: 'en', text: req.body.developerName});
  name.save();

  var position = new Translation();
  position.name = 'position';
  position.translation.push({language: 'en', text: req.body.position});
  position.save();

  var info = new Translation();
  info.name = 'info';
  info.translation.push({language: 'en', text: req.body.info});
  info.save();

  var newDeveloper = new Developer();
  // console.log(newDeveloper);
  newDeveloper.name = name._id;
  newDeveloper.imagePath = req.body.imagePath;
  newDeveloper.position = position._id;
  newDeveloper.info = info._id;
  console.log(newDeveloper);
  newDeveloper.save(function(err) {
    if (err) console.log(err);
  });
  res.redirect('/dashboard/developers/');
};
