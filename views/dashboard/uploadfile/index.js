'use strict';

var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var imageMagick = require('gm').subClass({imageMagick: true});
var async = require('async');

var PREVIEW_IMAGE = {size: 500, prefix: 'preview_'};
var FULL_IMAGE = {size: 1000, prefix: 'full_'};
var UPLOAD_DIR = path.join(__dirname, '../../../public/files');

exports.upload = function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../../../public/files');

  var uploadedFile = {};
  form.on('file', function(field, file) {
    uploadedFile.name = file.name;
    uploadedFile.path = file.path;
    console.log("Image_path: %s\nimage hash: %s", file.path, file.hash);
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
      function resizeImages(value, callback) {

        async.parallel({

          previewImage: function(callback) {
            var previewImagePath = UPLOAD_DIR + '/' +  PREVIEW_IMAGE.prefix + uploadedFile.path.split('/').pop();
            imageMagick(uploadedFile.path).resize(PREVIEW_IMAGE.size, PREVIEW_IMAGE.size).strip().interlace('Plane').quality(90).write(previewImagePath, function(err) {
              if (err) return callback(err);
              return callback(null, previewImagePath);
            });
          },

          fullImage: function(callback) {
            var fullImagePath = UPLOAD_DIR + '/' + FULL_IMAGE.prefix + uploadedFile.path.split('/').pop();
            imageMagick(uploadedFile.path).resize(FULL_IMAGE.size, FULL_IMAGE.size).strip().interlace('Plane').quality(90).write(fullImagePath, function(err) {
              if (err) return callback(err);
              return callback(null, fullImagePath);
            });
          }

        }, function(err, imagesPaths) {
          return callback(null, imagesPaths);
        });

      }], function responseWithLink(err, images) {

        //remove temporary file
        fs.unlink(uploadedFile.path, function(err) {
          if (err) {
            console.log(err);
          }
        });

        if (err) {
          // this mean what we receive file, not image
          // this logic not clear. Need to define special error meaning for hande different errors
          // not image type and error while imagemagick work
          console.log("we recieve file");
          res.status(200).send({
            uploadedFile: {file: uploadedFile.path}
          });

        } else {
          var previewPublicPath = images.previewImage.slice(images.previewImage.indexOf('/file'));
          var fullPublickPath = images.fullImage.slice(images.fullImage.indexOf('/file'));
          res.status(200).send({
            uploadedFile: {
              images: {preview: previewPublicPath, full: fullPublickPath}
            }
          });
        }

      });

    });
  form.parse(req);
};
