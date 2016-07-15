'use strict';

var config = require('config');

var viewModels = [];
for (var modelKeys in config.viewModels) {
  var model = config.viewModels[modelKeys];
  if (model.show) {
    var viewModel = {
      name: model.name,
      url: config.dashboard.url + '/' + model.name.toLowerCase()
    };
    console.log(viewModel);
    viewModels.push(viewModel);
  }
}

module.exports = function(req, res, next) {
  if (!res.locals.viewModels) {
    res.locals.viewModels = viewModels;
  }
  next();
};
