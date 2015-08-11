'use strict';

var socket = io.connect('http://localhost:3000');

module.exports = function(app) {
  
  app.controller('indexController', ['$scope', '$location', function($scope, $location) {
    
    $scope.welcomeMessage = 'Welcome to ChatMi!';
    $scope.description = 'Please enter a chatroom below, or create a new one!';
    
    $scope.getRooms = function() {
      socket.connect();
      socket.emit('homeLoad');
      socket.on('returnRoomList', function(data) {
        var roomList = document.getElementById('list');
        roomList.innerHTML = '';
        for (var i = 0; i < data.length; i++) {
          document.getElementById('list').innerHTML += '<a href="./#/'+data[i].name+'">'+data[i].name+'</a><br>';
        }
      });
    };

    $scope.edit = false;
    $scope.saveNewRoom = function(newRoomName) {
      if (/^[A-Za-z0-9\s]+$/.test(newRoomName)) {
        socket.emit('saveNewRoomtoDB', newRoomName);
        document.getElementById('list').innerHTML += '<a href="./#/'+newRoomName+'">'+newRoomName+'</a><br>';
        $scope.edit = false;
      } else {
        alert('Please enter a valid room name with only letters, numbers, and spaces!');
      }
    };

    $scope.cancelNewRoom = function() {
      $scope.newRoomName = null;
      $scope.edit = false;
    }
    
    $scope.$on("$locationChangeStart", function(event, next, current) { 
      socket.disconnect();
    });
  }]);
}