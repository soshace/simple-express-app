'use strict';

var lang = 'en';

function translateField(field, lang) {
  return field.find(function(element) {
    return element.language === lang;
  }).text;
}

var HttpError = require('error').HttpError;

exports.init = function(req, res, next) {
  var Developer = req.app.db.models.Developer;
  // Developer.getAllLikeDict(lang, function(err, developers) {
  Developer.getAllNamesIds(lang, function(err, developers) {
    console.log("Route developers: err: " + err);
    if (err) return next(err);
    console.log(developers);
    for (var index = 0; index < developers.length; index++) {
      developers[index].href = '/dashboard/developers/' + developers[index].id;
    }

    res.render('./dashboard/developers/index', {
        layout: 'dashboard',
        developers: developers
    });
  });
};

exports.getById = function(req, res, next) {
  var Developer = req.app.db.models.Developer;
  Developer.getDataById(req.params.id, lang, function(err, developer) {
    if (err) return next(err);
    res.render('./dashboard/developers/member/index', {
      layout: 'dashboard',
      developer: developer
    });
  });
};

exports.save = function(req, res, next) {
  var db = req.app.db;
  // console.log(db.models);
  var Developer = db.model('Developer');
  // console.log("Body on save " + JSON.stringify(req.body));

  var Translation = db.model('Translation');
  var name = new Translation();
  name.name = 'name';
  name.translation.push({language: lang, text: req.body.name});
  name.save();

  var position = new Translation();
  position.name = 'position';
  position.translation.push({language: lang, text: req.body.position});
  position.save();

  var info = new Translation();
  info.name = 'info';
  info.translation.push({language: lang, text: req.body.info});
  info.save();

  var newDeveloper = new Developer();
  // console.log(newDeveloper);
  newDeveloper.name.data = name._id;
  newDeveloper.imagePath.data = req.body.imagePath;
  newDeveloper.position.data = position._id;
  newDeveloper.info.data = info._id;
  // console.log(newDeveloper);
  newDeveloper.save(function(err) {
    if (err) console.log(err);
  });
  res.redirect('/dashboard/developers/');
};

exports.updateById = function(req, res, next) {
  var Developer = req.app.db.models.Developer;
  console.log(req.body);
  var newDeveloperData = {
    name: req.body.name,
    position: req.body.position,
    info: req.body.info,
    imagePath: req.body.imagePath
  };
  Developer.updateDataById(req.params.id, lang, newDeveloperData, function(err, developer) {
    if (err) return next(err);
    res.redirect('/dashboard/developers/');
  });
};
