(function() {
  'use strict';

  var COOKIE_NAME = 'locale';

  var langSelect = document.getElementById('selectLanguage');

  langSelect.addEventListener('change', setCookieLang);
  langSelect.addEventListener('change', sendGetRequest);

  detectLang();

  function detectLang() {
    console.log(document.cookie);
    var lang = getCookie(COOKIE_NAME);

    if (lang === 'en' || lang === 'ru') {
      langSelect.value = lang;
    } else {
      setLang('en');
    }
  }

  function setLang(lang) {
    langSelect.value = lang;
    setCookie(COOKIE_NAME, lang, {path: '/'});
  }

  function setCookieLang() {
    console.log("Set cookie: " + langSelect.value);
    setCookie(COOKIE_NAME, langSelect.value, {path: '/'});
    console.log(document.cookie);
  }

  function sendGetRequest() {
    window.location.replace(window.location.pathname);
  }

  function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }

    document.cookie = updatedCookie;
  }

}());


