(function() {
  'use strict';

  Dropzone.autoDiscover = false;
  document.addEventListener('DOMContentLoaded', function(event) {

    var myDropzone = new Dropzone(".dropzone-mendrew", { // Make the whole body a dropzone
      url: "/dashboard/uploadfile", // Set the url
      maxFiles: 1,
      thumbnailWidth: 120,
      thumbnailHeight: 120,
      addRemoveLinks: true,
      parallelUploads: 1,
      previewTemplate: document.getElementById('preview-template').innerHTML,
      // autoQueue: false, // Make sure the files aren't queued until manually added
      previewsContainer: "#previews", // Define the container to display the previews
      clickable: ".fileinput-button", // Define the element that should be used as click trigger to select files.

      init: function() {
        var uploadButton = document.querySelector(".image-upload")
        myDropzone = this;

        this.on('addedfile', function() {
          uploadButton.style.display = 'block';
        });

        this.on('reset', function() {
          uploadButton.style.display = 'none';
        });
      },
    });

  });
}());
