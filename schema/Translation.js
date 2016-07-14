'use strict';

exports = module.exports = function(app, mongoose) {
  var translationSchema = new mongoose.Schema({
    name: String,
    translation: [ {language: String, text: String} ]
  });

  translationSchema.methods.updateTranslatedField = function(lang, newValue) {
    var field = this;
    var fieldUpdate = false;
    for (var index = 0; index < field.translation.length; index++) {
      if (field.translation[index].language == lang) {
        field.translation[index].text = newValue;
        fieldUpdate = true;
        break;
      }
    }
    if (fieldUpdate) {
        field.save();
        return;
    }

    field.translation.push({language: lang, text: newValue});
    field.save();
  };

  app.db.model('Translation', translationSchema);
};


