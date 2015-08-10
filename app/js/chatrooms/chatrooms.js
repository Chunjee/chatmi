'use strict';

module.exports = function(app) {
  require('./controllers/chatrooms_controller.js')(app);
}