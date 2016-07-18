(function() {
  'use strict';

  window.addEventListener("load", function() {
    var modelElements = document.querySelectorAll('.model-element');

    for (var modelIndex = 0; modelIndex < modelElements.length; modelIndex++) {
      var model = modelElements[modelIndex];

      var trash = model.querySelector('.delete-trash');

      var deleteHref = model.querySelector('.delete-href').href;
      console.log("model: %s", model);

      trash.addEventListener('click', (function(rootObject, url) {
        return function(event) {
          event.preventDefault();
          deleteRequest(rootObject, url);
        }
      })(model, deleteHref));
    }
  });

  function deleteRequest(rootElement, url) {

    rootElement.classList.add("danger", "link-not-active");

    var request = new XMLHttpRequest();

    request.open('DELETE', url, true);
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 200) {
          rootElement.style.display = "none";
        } else {
          rootElement.classList.remove("danger", "link-not-active");
        }
      }
    };
    request.send();
  }

}());
