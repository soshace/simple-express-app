'use strict';


exports.init = function(req, res, next){
  res.render('./dashboard/login/index', {
    layout: 'dashboard',
    title: 'Login',
    messages: req.flash('error'),
  });
};

