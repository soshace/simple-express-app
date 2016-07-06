'use strict';

exports = module.exports = function(app, mongoose) {
  var translationSchema = new mongoose.Schema({
    name: String,
    translation: [ {language: String, text: String} ]
  });

  app.db.model('Translation', translationSchema);
};
