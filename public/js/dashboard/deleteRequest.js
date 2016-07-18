(function() {
  'use strict';

  window.addEventListener("load", function() {
    var modelElements = document.querySelectorAll('.model-element');

    for (var modelIndex = 0; modelIndex < modelElements.length; modelIndex++) {
      var model = modelElements[modelIndex];

      var trash = model.querySelector('.delete-trash');

      var deleteHref = model.querySelector('.delete-href').href;

      trash.addEventListener('click', (function(url) {
        return function(event) {
          deleteRequest(url);
        }
      })(deleteHref));
    }
  });


  function deleteRequest(url) {
    var request = new XMLHttpRequest();

    request.open('DELETE', url, true);
    request.send();
  }
}());
