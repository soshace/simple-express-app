'use strict';

exports.init = function(req, res){
  res.render('./dashboard/index', {layout: 'dashboard', title: 'Dashboard'});
};
