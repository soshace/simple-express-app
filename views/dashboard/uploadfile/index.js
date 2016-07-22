'use strict';

var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var imageMagick = require('gm').subClass({imageMagick: true});
var async = require('async');

exports.upload = function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../../../public/files');

  var uploadedFile = {};
  form.on('file', function(field, file) {
    uploadedFile.name = file.name;
    uploadedFile.path = file.path;
  });

  form.on('error', function(err) {
    console.log("An error has occured while upload files: \n" + err);
    res.status(404).end();
  });

  form.on('end', function() {
    async.waterfall([
      function checkFileFormat(callback) {
        imageMagick(uploadedFile.path).format(function(err, value) {
          if (err) {
            console.log("Error in determinate uploaded filetype: %s", err);
            return callback(err);
          } else {
            return callback(null, value);
          }
        });
      },
      function resizeImage(value, callback) {
        var resizeFilePath = path.join(__dirname, '../../../public/files/resize' + uploadedFile.name);
        imageMagick(uploadedFile.path).resize(500, 500).noProfile().write(resizeFilePath, function(err) {
          if (err) return callback(err);
          return callback(null, resizeFilePath);
        });
      }], function responseWithLink(err, filePath) {

        if (err) {
          console.log(err);
          res.status(415).end("Unsupported Media Type");
        } else {
          var publicPath = filePath.slice(filePath.indexOf('/file'));
          res.status(200).send({uploadedFile: publicPath});
        }
      });

    });
  form.parse(req);
};
