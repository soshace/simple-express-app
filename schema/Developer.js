'use strict';

exports = module.exports = function(app, mongoose) {
  var developerSchema = new mongoose.Schema({
    name: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation'},
    imagePath: {type: String, required: true},
    position: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation'},
    info: {type: mongoose.Schema.Types.ObjectId, ref: 'Translation'}
  });

  app.db.model('Developer', developerSchema);
};
