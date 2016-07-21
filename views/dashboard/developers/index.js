'use strict';

var sleep = require('sleep');

var language = require('config').language.cookiesVariable;

var HttpError = require('error').HttpError;

exports.init = function(req, res, next) {
  var Developer = req.app.db.models.Developer;
  Developer.getAllNamesIds(req.cookies[language], function(err, developers) {
    if (err) return next(err);
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
  Developer.getDataById(req.params.id, req.cookies[language], function(err, developer) {
    if (err) return next(err);
    res.render('./dashboard/developers/member/index', {
      layout: 'dashboard',
      developer: developer
    });
  });
};

exports.save = function(req, res, next) {
  var db = req.app.db;
  var lang = req.cookies[language];

  var publicDeveloper = createDeveloper(db, lang);
  var storageDeveloper = createDeveloper(db, lang);

  publicDeveloper.storage = storageDeveloper._id;
  storageDeveloper.public = false;

  // console.log(newDeveloper);
  storageDeveloper.save(function(err) {
    if (err) console.log(err);

    publicDeveloper.save(function(err) {
      if (err) console.log(err);
    });
  });

  res.redirect('/dashboard/developers/');

  function createDeveloper(db, lang) {
    var Developer = db.model('Developer');
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
    newDeveloper.name.data = name._id;
    newDeveloper.imagePath.data = req.body.imagePath;
    newDeveloper.position.data = position._id;
    newDeveloper.info.data = info._id;
    return newDeveloper;
  }
};

exports.updateById = function(req, res, next) {
  var Developer = req.app.db.models.Developer;
  var newDeveloperData = {
    name: req.body.name,
    position: req.body.position,
    info: req.body.info,
    imagePath: req.body.imagePath,
    savePlace: req.body.formId
  };

  console.log("savePlace: %s", newDeveloperData.savePlace);
  Developer.updateById(req.params.id,
    req.cookies[language],
    newDeveloperData,
    function(err, developer) {
      if (err) return next(err);
      // need to send flash messages
      res.status(200).end();
    }
  );
};

exports.deleteById = function(req, res, next) {
  var Developer = req.app.db.models.Developer;
  console.log("We receive DELETE request!");
  Developer.findByIdAndRemove(req.params.id, function(err)  {
    if (err) {
      res.status(404).end();
    } else {
      res.status(200).end();
    }

  });
};
