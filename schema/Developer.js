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
      // data: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation'},
      // meta: {
      //   tagType: {type: String, default: "input"},
      //   tagAttribute: {type: String, default: "text"}
      // }
  });

  developerSchema.statics.getAllLikeDict = function(lang, callback) {
    var Developer = this;

    Developer.find({})
      .populate('name')
      .populate('position')
      .populate('info')
      .exec(function(err, developers) {

      if (err) callback(err);

      if (!developers) {
        callback(new HttpError(404, "Developers not found"));
      }

      var developersDict = [];

      for (var index = 0; index < developers.length; index++) {
        var developer = developers[index];

        var developerData = {};
        developerData.name = translateField(developer.name.translation, lang);
        developerData.position = translateField(developer.position.translation, lang);
        developerData.info =  translateField(developer.info.translation, lang);

        developersDict.push(developerData);
      }
      console.log("developersDict at the end: " + developersDict);
      callback(null, developersDict);
    });

  };

  developerSchema.statics.getAllNamesIds = function(lang, callback) {
    var Developer = this;

    Developer.find({}).populate('name').exec(function(err, developers) {
      if (!developers) {
        callback(new HttpError(404, "Developers not found"));
      }

      var developersDict = [];

      for (var index = 0; index < developers.length; index++) {
        var developer = developers[index];

        var developerData = {};
        developerData.name = translateField(developer.name.translation, lang);
        developerData.id = developer._id;

        developersDict.push(developerData);
      }

      callback(null, developersDict);
    });
  };

  developerSchema.statics.getDataById = function(id, lang, callback) {
    var Developer = this;

    Developer.findById(id).populate('name').populate('position').populate('info').exec(function(err, developer) {
      if (err) callback(err);

      if (!developer) {
        callback(new HttpError(404, "User not found"));
      }

      var developerData = {};
      developerData.name = translateField(developer.name.translation, lang);
      developerData.position = translateField(developer.position.translation, lang);
      developerData.info =  translateField(developer.info.translation, lang);
      developerData.imagePath = developer.imagePath;

      callback(null, developerData);

    });

  };


  app.db.model('Developer', developerSchema);
};
