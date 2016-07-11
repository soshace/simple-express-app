exports.logout = function(req, res, next){
  req.session.destroy();
  res.redirect('/dashboard');
};
