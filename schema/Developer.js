'use strict';

var HttpError = require('error').HttpError;

function translateField(field, lang) {
  return field.find(function(element) {
    return element.language === lang;
  }).text;
}

// function updateTranslatedField(field, lang, newValue) {
//    field.find(function(element) {
//     return element.language === lang;
//   }).text;
// }

exports = module.exports = function(app, mongoose) {
  var developerSchema = new mongoose.Schema({
    name: {
      data: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation', required: true},
      meta: {
        tagType: {type: String, default: "input"},
        tagAttributeType: {type: String, default: "text"}
      }
    },
    position: {
      data: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation', required: true},
      meta: {
        tagType: {type: String, default: "input"},
        tagAttributeType: {type: String, default: "text"}
      }
    },
    info: {
      data: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation', required: true},
      meta: {
        tagType: {type: String, default: "textarea"},
        tagAttributeType: {type: String, default: "text"}
      }
    },
    imagePath: {
      data: {type: String, required: true},
      meta: {
        tagType: {type: String, default: "input"},
        tagAttributeType: {type: String, default: "file"}
      }
    }
  });

  developerSchema.statics.getAllLikeDict = function(lang, callback) {
    var Developer = this;

    Developer.find({})
      .populate('name.data')
      .populate('position.data')
      .populate('info.data')
      .exec(function(err, developers) {

      if (err) return callback(err);

      console.log("getAllNamesIds developers: " + developers);
      if (!developers) {
        return callback(new HttpError(404, "Developers not found"));
      }

      var developersDict = [];

      for (var index = 0; index < developers.length; index++) {
        var developer = developers[index];

        var developerData = {};
        developerData.name = translateField(developer.name.data.translation, lang);
        developerData.position = translateField(developer.position.data.translation, lang);
        developerData.info =  translateField(developer.info.data.translation, lang);

        developersDict.push(developerData);
      }
      console.log("developersDict at the end: " + developersDict);
      return callback(null, developersDict);
    });

  };

  developerSchema.statics.getAllNamesIds = function(lang, callback) {
    var Developer = this;

    Developer.find({}).populate('name.data').exec(function(err, developers) {
      console.log("getAllNamesIds developers err: " + err);
      if (err) return callback(err);

      console.log("getAllNamesIds developers: " + developers);
      if (!developers) {
        return callback(new HttpError(404, "Developers not found"));
      }

      var developersDict = [];

      for (var index = 0; index < developers.length; index++) {
        var developer = developers[index];

        var developerData = {};
        developerData.name = translateField(developer.name.data.translation, lang);
        developerData.id = developer._id;

        developersDict.push(developerData);
      }

      return callback(null, developersDict);
    });
  };

  developerSchema.statics.getDataById = function(id, lang, callback) {
    var Developer = this;

    Developer.findById(id).populate('name.data').populate('position.data').populate('info.data').exec(function(err, developer) {
      if (err) return callback(err);

      console.log("Error in getDataById: " + err + " developer: " + developer);

      if (!developer) {
        return callback(new HttpError(404, "Developer not found"));
      }

      var developerData = {};
      developerData.name = translateField(developer.name.data.translation, lang);
      developerData.position = translateField(developer.position.data.translation, lang);
      developerData.info =  translateField(developer.info.data.translation, lang);
      developerData.imagePath = developer.imagePath.data;

      return callback(null, developerData);

    });

  };

  // developerSchema.statics.updateDataById = function(id, lang, newDeveloperData, callback) {
  //   var Developer = this;

  //   Developer.findById(id).populate('name.data').populate('position.data').populate('info.data').exec(function(err, developer) {
  //     if (err) return callback(err);

  //     console.log("Error in getDataById: " + err + " developer: " + developer);

  //     if (!developer) {
  //       return callback(new HttpError(404, "Developer not found"));
  //     }

  //     var developerData = {};
  //     developerData.name = translateField(developer.name.data.translation, lang);
  //     developerData.position = translateField(developer.position.data.translation, lang);
  //     developerData.info =  translateField(developer.info.data.translation, lang);
  //     developerData.imagePath = developer.imagePath.data;

  //     return callback(null, developerData);

  //   });
  // });


  app.db.model('Developer', developerSchema);
};
