(function() {
  'use strict';

  // transform cropper dataURI output to a Blob which Dropzone accepts
  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  // modal window template
  var modalTemplate = '<div class="modal"><!-- bootstrap modal here --></div>';


  Dropzone.autoDiscover = false;
  document.addEventListener('DOMContentLoaded', function(event) {

    var myDropzone = new Dropzone(".dropzone", { // Make the whole body a dropzone
      url: "/dashboard/uploadfile", // Set the url
      autoProcessQueue: false,
      maxFiles: 1,
      thumbnailWidth: 120,
      thumbnailHeight: 190,
      addRemoveLinks: true,
      parallelUploads: 1,
      clickable: " .change-image", // Define the element that should be used as click trigger to select files.

      // init: function() {
      //   var uploadButton = document.querySelector(".image-upload")
      //   myDropzone = this;

      //   this.on('addedfile', function() {
      //     uploadButton.style.display = 'block';
      //   });

      //   this.on('reset', function() {
      //     uploadButton.style.display = 'none';
      //   });

      //   this.on('success', function(event, response) {
      //     document.getElementById('imagePathPublish').value = response.uploadedFile;
      //     var image = document.querySelector('.img-developer').src = response.uploadedFile;

      //   });
      // },
    });


    // listen to thumbnail event
    myDropzone.on('thumbnail', function (file) {
      // ignore files which were already cropped and re-rendered
      // to prevent infinite loop
      if (file.cropped) {
        return;
      }
      if (file.width < 800) {
        // validate width to prevent too small files to be uploaded
        // .. add some error message here
        return;
      }
      // cache filename to re-assign it to cropped file
      var cachedFilename = file.name;
      // remove not cropped file from dropzone (we will replace it later)
      myDropzone.removeFile(file);

      // dynamically create modals to allow multiple files processing
      var $cropperModal = $(modalTemplate);
      // 'Crop and Upload' button in a modal
      var $uploadCrop = $cropperModal.find('.crop-upload');

      var $img = $('<img />');
      // initialize FileReader which reads uploaded file
      var reader = new FileReader();
      reader.onloadend = function () {
        // add uploaded and read image to modal
        $cropperModal.find('.image-container').html($img);
        $img.attr('src', reader.result);

        // initialize cropper for uploaded image
        $img.cropper({
          aspectRatio: 16 / 9,
          autoCropArea: 1,
          movable: false,
          cropBoxResizable: true,
          minContainerWidth: 850
        });
      };
      // read uploaded file (triggers code above)
      reader.readAsDataURL(file);

      $cropperModal.modal('show');

      // listener for 'Crop and Upload' button in modal
      $uploadCrop.on('click', function() {
        // get cropped image data
        var blob = $img.cropper('getCroppedCanvas').toDataURL();
        // transform it to Blob object
        var newFile = dataURItoBlob(blob);
        // set 'cropped to true' (so that we don't get to that listener again)
        newFile.cropped = true;
        // assign original filename
        newFile.name = cachedFilename;

        // add cropped file to dropzone
        myDropzone.addFile(newFile);
        // upload cropped file with dropzone
        myDropzone.processQueue();
        $cropperModal.modal('hide');
      });
    });
  });

}());
