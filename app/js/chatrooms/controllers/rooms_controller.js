'use strict';

var socket = io.connect('http://localhost:3000');

module.exports = function(app) {

  app.controller('chatroomController', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
    $scope.roomname = $routeParams.room;

    $scope.loadChatroom = function() {
      socket.connect();
      socket.emit('roomLoad', $routeParams.room);

      (function() {
        var getNode = function(element) {
          return document.querySelector(element);
        };

        // Get required nodes
        var status = getNode('.chat-status span');
        var messageDisplay = getNode('.chat-messages');
        var textArea = getNode('.chat textarea');
        var chatName = getNode('.chat-name');
        
        var statusDefault = status.textContent;
        var setStatus = function(s) {
          status.textContent = s;

          if (s !== statusDefault) {
            var delay = setTimeout(function() {
              setStatus(statusDefault);
              clearInterval(delay);
            }, 3000);
          }
        };

        // Try connection
        try {
          var socket = io.connect('localhost:3000');
        } catch(e) {
          console.log(e);
        }

        if (socket !== undefined) {
          // Listen for output
          socket.on('output', function(data) {
            if (data.length) {
              // Loop through results
              for (var i = 0; i < data.length; i++) {
                var message = document.createElement('p');
                message.setAttribute('class', 'chat-message');

                var messageTimeStamp = document.createElement('span');
                messageTimeStamp.setAttribute('class', 'message-timestamp');
                messageTimeStamp.textContent = data[i].timeStamp;

                var messageName = document.createElement('span');
                messageName.setAttribute('class', 'message-name');
                messageName.textContent = ' ' + data[i].name + ' ';

                var messageContent = document.createElement('span');
                messageContent.setAttribute('class', 'message-content');
                messageContent.textContent = data[i].message;

                message.appendChild(messageTimeStamp);
                message.appendChild(messageName);
                message.appendChild(messageContent);

                messageDisplay.appendChild(message);
              }
            }
            updateScroll();
          });

          // Listen for a status
          socket.on('status', function(data) {
            setStatus((typeof data === 'object') ? data.message : data);
            if (data.clear === true) {
              textArea.value = '';
            }
          });

          // Listen for keydown
          textArea.addEventListener('keydown', function(event) {
            var self = this;
            var name = chatName.value;

            if (event.which === 13 && event.shiftKey === false) {
              var currentDate = new Date;

              // Format timestamp to XX:XX, AM/PM
              function hourSuffix() {
                var currentHour = currentDate.getHours();
                var currentMinute = currentDate.getMinutes();
                if (currentHour > 12) {
                  currentHour = currentDate.getHours() - 12;
                }
                if (currentMinute < 10) {
                  currentMinute = "0" + currentMinute;
                }
                if (currentHour < 10) {
                  currentHour = "0" + currentHour;
                  return currentHour + ":" + currentMinute + "pm";
                } else {
                  return currentHour + ":" + currentMinute + "am";
                }
              }

              var timeStamp = hourSuffix();
              socket.emit('input', {
                name: name, 
                message: self.value,
                timeStamp: timeStamp
              });
              event.preventDefault();
            }
          });
        }
      })();

      // Scroll to most recent message
      var updateScroll = function() {
        var element = document.getElementById("scrollbox");
        element.scrollTop = element.scrollHeight;
      };
      document.onload = updateScroll();
    }; //end loadChatroom

    $scope.$on("$locationChangeStart", function(event, next, current) { 
      socket.disconnect();
    });

  }]); //end controller
}