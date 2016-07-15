(function() {
  'use strict';

  window.addEventListener("load", function() {
    var modelElements = document.querySelectorAll('.model-element');
    console.log("We find: " + modelElements.length);
    for (var modelIndex = 0; modelIndex < modelElements.length; modelIndex++) {
      console.log("modelElement[%s]: %s", modelIndex,  modelElements[modelIndex]);
      var model = modelElements[modelIndex];

      var trash = model.querySelector('.delete-trash');
      console.log("Trash: " + trash);

      var deleteHref = model.querySelector('.delete-href').href;
      console.log("href: = " + deleteHref);

      trash.addEventListener('click', function(event) {
        var href = deleteHref;
        console.log("Href: " + href);
        // deleteRequest(href);
      });
    }
  });


  function deleteRequest(url) {
    var request = new XMLHttpRequest();

    console.log("We try to send DELETE request to url: " + url);
    request.onload = function () {
      console.log('Inside the onload event');
    };
    // request.onreadystatechange = function () {
    //   console.log('Inside the onreadystatechange event with readyState: ' +
    //     toReadyStateDescription(request.readyState));
    // };
    request.open('DELETE', url, true);
    // request.send();
  }
}());
