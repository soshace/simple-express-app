'use strict';

exports = module.exports = function(app, mongoose) {
  var translationSchema = new mongoose.Schema({
    name: String,
    translation: [ {language: String, text: String} ]
  });

  translationSchema.methods.updateTranslatedField = function(lang, newValue) {
    var field = this;
    for (var index = 0; index < field.translation.length; index++) {
      if (field.translation[index].language == lang) {
        field.translation[index].text = newValue;
        field.save();
        return;
      }
    }
  };

  app.db.model('Translation', translationSchema);
};


