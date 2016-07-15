var acceptLanguage = require('accept-language');
var language = require('config').language;

module.exports = function (req, res, next) {
  if (!req.cookies[language.cookiesVariable])  {
    var acceptLang = acceptLanguage.get(req.get('Accept-Language') || language.default);
    var lang = req.cookies[language.cookiesVariable] || acceptLang.slice(0, 2) || language.default;

    // detect if language supports by server settings
    lang = ~language.support.indexOf(lang) ? lang : language.default;
    res.cookies(language.cookiesVariable, lang);
  }

  next();
};
