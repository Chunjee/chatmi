'use strict';

require('angular/angular');
require('angular-route');

var chatroomApp = angular.module('chatroomApp', ['ngRoute']);

require('./chatrooms/chatrooms.js')(chatroomApp);
require('./routes/router.js')(chatroomApp)

