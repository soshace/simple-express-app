'use strict';

exports = module.exports = function(app, mongoose) {
  //embeddable docs first
  require('./schema/Developer')(app, mongoose);
  require('./schema/Translation')(app, mongoose);
  require('./schema/User')(app, mongoose);

  //then regular docs
  // require('./schema/User')(app, mongoose);
  // require('./schema/Admin')(app, mongoose);
  // require('./schema/AdminGroup')(app, mongoose);
  // require('./schema/Account')(app, mongoose);
  // require('./schema/LoginAttempt')(app, mongoose);
};

