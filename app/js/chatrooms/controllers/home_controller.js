'use strict';

var socket = io.connect('http://localhost:3000');

module.exports = function(app) {
  
  app.controller('indexController', ['$scope', '$location', function($scope, $location) {
    
    $scope.welcomeMessage = 'Welcome to ChatMi!';
    $scope.description = 'Join a chatroom below, or create a new one!';
    
    // Returns number of users online
    socket.on('numOnline', function(data) {
      $scope.numOnline = String(data);
      $scope.$apply();
    });
    
    // Returns list of chatrooms
    $scope.getRooms = function() {
      $scope.rooms = [];
      socket.connect();
      socket.emit('homeLoad');
      socket.on('returnRoomList', function(data) {
        var roomList = document.getElementById('list');
        roomList.innerHTML = '';
        for (var i = 0; i < data.length; i++) {
          var link = document.createElement('a');
          link.setAttribute('href', './#/'+data[i].name);
          link.setAttribute('class', 'roomName');
          link.textContent = data[i].name;
          roomList.appendChild(link);
        }
        for (var i = 0; i < data.length; i++) {
          $scope.rooms.push(data[i].name);
        }
        $scope.$apply();
      });
    };


    // Validates new chatroom name, saves new chatroom to DB, displays it
    $scope.edit = false;
    $scope.saveNewRoom = function(newRoomName) {
      if (/^[A-Za-z0-9\s]+$/.test(newRoomName) == false || newRoomName === undefined) {
        alert('Please enter a valid room name with only letters, numbers, and spaces!');
      } else if (newRoomName === 'rooms') {
        alert('\"rooms\" is a special keyword! Please try something else!');
      } else if ($scope.rooms.indexOf(newRoomName) > -1) {
        alert(newRoomName + ' already exists!');
      } else {
        socket.emit('saveNewRoomtoDB', newRoomName);
        var roomList = document.getElementById('list');
        var link = document.createElement('a');
        link.setAttribute('href', './#/'+newRoomName);
        link.setAttribute('class', 'roomName');
        link.textContent = newRoomName;
        roomList.appendChild(link);
        $scope.edit = false;
      }
    };

    $scope.cancelNewRoom = function() {
      $scope.newRoomName = null;
      $scope.edit = false;
    };
    
    // Disconnects current socket when leaving a room
    $scope.$on("$locationChangeStart", function(event, next, current) { 
      socket.disconnect();
    });
  }]);
}