'use strict';

module.exports = function(app) {
  require('./controllers/home_controller.js')(app);
  require('./controllers/rooms_controller.js')(app);
}