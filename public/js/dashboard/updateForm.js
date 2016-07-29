(function() {
  'use strict';

  var SENDING_URL = '/dashboard/developer/post';

  window.addEventListener("load", function() {

    var storageButtons = document.querySelectorAll('.storage-button');
    for (var buttonIndex = 0; buttonIndex < storageButtons.length; buttonIndex++) {
      storageButtons[buttonIndex].addEventListener('click', function(event) {
        event.preventDefault();
        sendFormPost(this.form, '', {formId: 'storage'});
      });
    }

    var publishButtons = document.querySelectorAll('.publish-button');
    for (var buttonIndex = 0; buttonIndex < publishButtons.length; buttonIndex++) {
      publishButtons[buttonIndex].addEventListener('click', function(event) {
        event.preventDefault();
        sendFormPost(this.form, '', {formId: 'publish'});
      });
    }
  });

  function sendFormPost(form, url, additionalFields) {
    var formData = new FormData(form);
    var formObject = {};

    for (var pair of formData.entries()) {
      formObject[pair[0]] = pair[1];
    }

    for (var key in additionalFields) {
      formObject[key] = additionalFields[key];
    }

    var body = JSON.stringify(formObject);
    console.log(body);

    sendJSONPost(url, body);
  }

  function sendJSONPost(url, body) {
    var request = new XMLHttpRequest();
    request.open("POST", url, true);

    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

    request.onreadystatechange = function() {
      if (this.readyState != 4) return;
      // alert(this.responseText);
      console.log("We recive answer");
    }

    request.send(body);
  }


}());
