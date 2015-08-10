'use strict';

module.exports = function(app) {
  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: './views/home.html',
        controller: 'indexController'
      }).when('/:room', {
        templateUrl: './views/room.html',
        controller: 'chatroomController',
        controllerAs: 'chatroomApp'
      }).otherwise({
        redirectTo: '/'
      });
  }]);
}