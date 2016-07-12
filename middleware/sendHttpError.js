module.exports = function(req, res, next) {
  res.sendHttpError = function(error) {
    if (error.status) res.status(error.status);
    if (res.req.headers['s-requested-with'] == 'XMLHttpRequest') {
      console.log("res.req.header");
      res.json(error);
    } else {
      res.render("dashboard/developers/index", {layout: 'dashboard', error: error});
    }
  };

  next();
};
