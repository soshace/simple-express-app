'use strict';

function translateField(field, lang) {
  return field.find(function(element) {
    return element.language === lang;
  }).text;
}

exports = module.exports = function(app, mongoose) {
  var developerSchema = new mongoose.Schema({
    name: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation'},
    imagePath: {type: String, required: true},
    position: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation'},
    info: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation'}
  });

  developerSchema.statics.getAllLikeDict = function(lang, callback) {
    var Developer = this;

    Developer.find({})
      .populate('name')
      .populate('position')
      .populate('info')
      .exec(function(err, developers) {

      if (!developers) {
        callback(new HttpError(404, "Developers not found"));
      }

      var developersDict = [];

      for (var index = 0; index < developers.length; index++) {
        var developer = developers[index];

        var developer_info = {};
        developer_info.name = translateField(developer.name.translation, lang);
        developer_info.position = translateField(developer.position.translation, lang);
        developer_info.info =  translateField(developer.info.translation, lang);

        developersDict.push(developer_info);
      }
      console.log("developersDict at the end: " + developersDict);
      callback(null, developersDict);
    });

  };

  app.db.model('Developer', developerSchema);
};
