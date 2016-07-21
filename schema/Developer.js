'use strict';

var async = require('async');

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
      public: {$ne: false}
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

    async.waterfall([
      findDeveloper,
      getDeveloperValues,
      findDeveloperStorage,
      getDeveloperStorageValues
    ], function(err, developerData) {
      if (err) return callback(err);
      return callback(null, developerData);
    });

    function findDeveloper(callback) {
      Developer.findById(id).populate('name.data')
        .populate('position.data')
        .populate('info.data')
        .populate('storage')
        .exec(callback);
    }

    function getDeveloperValues(developer, callback) {
      if (!developer) {
        return callback(new HttpError(404, "Developer not found"));
      }

      var developerData = {};
      developerData.name = developer.name.data.translateField(lang);
      developerData.position = developer.position.data.translateField(lang);
      developerData.info =  developer.info.data.translateField(lang);
      developerData.imagePath = developer.imagePath.data;
      if (developer.storage) {
        var storageId = developer.storage._id;
      }

      callback(null, storageId, developerData);
    }

    function findDeveloperStorage(storageId, developerData, callback) {
      if (!storageId) {
        callback(null, null, developerData);
      }

      Developer.findById(storageId)
        .populate('name.data')
        .populate('position.data')
        .populate('info.data')
        .populate('storage')
        .exec(function(err, developerStorage) {
          callback(err, developerStorage, developerData);
        });
    }

    function getDeveloperStorageValues(developerStorage, developerData, callback) {
        if (!developerStorage) {
          return callback(new HttpError(404, "Developer storage not found"));
        }

        if (developerStorage) {
          developerData.storage = {};
          developerData.storage.name = developerStorage.name.data.translateField(lang);
          developerData.storage.position = developerStorage.position.data.translateField(lang);
          developerData.storage.info =  developerStorage.info.data.translateField(lang);
          developerData.storage.imagePath = developerStorage.imagePath.data;
        }

        return callback(null, developerData);
    }
  };

  developerSchema.statics.updateById = function(id, lang, newDeveloperData, callback) {
    var Developer = this;

    async.waterfall([
      findDeveloper,
      findDeveloperStorage,
      updateDeveloper,
    ], function(err, developer) {
      if (err) return callback(err);
      return callback(null, developer);
    });

    function findDeveloper(callback) {
      Developer.findById(id).populate('name.data')
        .populate('position.data')
        .populate('info.data')
        .populate('storage')
        .exec(callback);
    }

    function findDeveloperStorage(developer, callback) {
      if (!developer) {
        return callback(new HttpError(404, "Developer not found"));
      }

      if (newDeveloperData.savePlace === 'storage' && developer.storage) {
        var storageId = developer.storage._id;
        Developer.findById(storageId).populate('name.data')
          .populate('position.data')
          .populate('info.data')
          .populate('storage')
          .exec(callback);
      } else {
        callback(null, developer);
      }
    }

    function updateDeveloper(developer, callback) {
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
    }
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
