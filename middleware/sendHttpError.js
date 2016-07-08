module.exports = function(req, res, next) {
  res.sendHttpError = function(error) {
    res.status(error.status);
    if (res.req.headers['s-requested-with'] == 'XMLHttpRequest') {
      res.json(error);
    } else {
      res.render("dashboard/developers/index", {layout: 'dashboard', error: error});
    }
  };

  next();
};
