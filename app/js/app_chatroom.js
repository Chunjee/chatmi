'use strict';

var socket = io.connect(process.env.SOCKET || 'localhost:3000');

(function() {

  // Get required DOM elements
  var status = document.getElementById('current-status');
  var messageDisplay = document.getElementById('chat-message-display');
  var textArea = document.querySelector('#chatroom-container textarea');
  var chatName = document.getElementById('chat-username');
  var statusDefault = status.textContent;

  // Listen for a status
  socket.on('status', function(data) {
    status.textContent = data.message;
    if (data.message !== statusDefault) {
      var delay = setTimeout(function() {
        status.textContent = statusDefault;
        clearInterval(delay);
      }, 3000);
    }
    if (data.clear === true) {
      textArea.value = '';
    }
  });

  // Listen for keydown
  textArea.addEventListener('keydown', function(event) {
    var messageContent = this.value;
    var username = chatName.value;

    if (event.which === 13 && event.shiftKey === false) {
      // Format timestamp to XX:XX AM/PM
      function makeTimeStamp() {
        var currentDate = new Date;
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

      // Send message to server
      socket.emit('newMessage', {
        name: username, 
        message: messageContent,
        timeStamp: makeTimeStamp()
      }, roomName);
      event.preventDefault();
    }
  });
})();