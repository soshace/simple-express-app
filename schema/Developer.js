'use strict';

var HttpError = require('error').HttpError;

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
    },
    public: {type: Boolean, default: true},
    storage: {type :mongoose.Schema.Types.ObjectId, ref: 'Developer'}
  });

  developerSchema.statics.getAllLikeDict = function(lang, callback) {
    var Developer = this;

    Developer.find({})
      .populate('name.data')
      .populate('position.data')
      .populate('info.data')
      .exec(function(err, developers) {

      if (err) return callback(err);

      if (!developers) {
        return callback(new HttpError(404, "Developers not found"));
      }

      var developersDict = [];

      for (var index = 0; index < developers.length; index++) {
        var developer = developers[index];

        var developerData = {};
        developerData.name = developer.name.data.translateField(lang);
        developerData.position = developer.position.data.translateField(lang);
        developerData.info =  developer.info.data.translateField(lang);

        developersDict.push(developerData);
      }
      return callback(null, developersDict);
    });

  };

  developerSchema.statics.getAllNamesIds = function(lang, callback) {
    var Developer = this;

    // public not true
    var queryOptions = {
      public: {$ne: true}
    };

    Developer.find(queryOptions).populate('name.data').exec(function(err, developers) {
      if (err) return callback(err);

      if (!developers) {
        return callback(new HttpError(404, "Developers not found"));
      }

      var developersDict = [];

      for (var index = 0; index < developers.length; index++) {
        var developer = developers[index];

        var developerData = {};
        developerData.name = developer.name.data.translateField(lang);
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

      if (!developer) {
        return callback(new HttpError(404, "Developer not found"));
      }

      var developerData = {};
      developerData.name = developer.name.data.translateField(lang);
      developerData.position = developer.position.data.translateField(lang);
      developerData.info =  developer.info.data.translateField(lang);
      developerData.imagePath = developer.imagePath.data;

      return callback(null, developerData);

    });

  };

  developerSchema.statics.updateDataById = function(id, lang, newDeveloperData, callback) {
    var Developer = this;

    Developer.findById(id)
      .populate('name.data')
      .populate('position.data')
      .populate('info.data')
      .exec(function(err, developer) {
        if (err) return callback(err);

        if (!developer) {
          return callback(new HttpError(404, "Developer not found"));
        }


        developer.name.data.updateTranslatedField(lang, newDeveloperData.name);
        developer.position.data.updateTranslatedField(lang, newDeveloperData.position);
        developer.info.data.updateTranslatedField(lang, newDeveloperData.info);
        developer.imagePath.data = newDeveloperData.imagePath;

        developer.save(function(err) {
          if (err) return callback(err);
          return callback(null, developer);
        });

      });
  };

  app.db.model('Developer', developerSchema);
};
