'use strict';

var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

exports.upload = function(req, res, next) {
  var form = new formidable.IncomingForm();
  // form.multiples = true;
  form.uploadDir = path.join(__dirname, '../../../public/files');

  var uploadedFile = {};
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    uploadedFile.url = '/public/files/' + file.name;
  });

  form.on('error', function(err) {
    console.log("An error has occured: \n" + err);
    res.status(404).end();
  });

  form.on('end', function() {
    res.status(200).send({uploadedFile: uploadedFile});
  });

  form.parse(req);

  // console.log(req.files);
  // res.end();
}
