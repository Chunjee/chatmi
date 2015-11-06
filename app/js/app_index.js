'use strict';

var socket = io.connect(process.env.SOCKET || 'localhost:3000', {forceNew: true});

// updates number online
socket.on('numOnline', function(data) {
  $('#num-online').text(data)
});
socket.emit('indexLoad');

// new chatroom form handlers
$('#add-new-room').click(function() {
  $('#new-room-form').toggleClass('hidden');
  $(this).toggleClass('hidden');
});

$('#save-new-room').click(function() {
  var newRoomName = $('#new-room-input').val();
  
  if (/^[A-Za-z0-9\s]+$/.test(newRoomName) == false || newRoomName === undefined) {
    alert('Please enter a valid room name with only letters, numbers, and spaces!');
  } else if (newRoomName === 'rooms') {
    alert('\"rooms\" is a special keyword! Please try something else!');
  } else {
    socket.emit('validateNewRoom', newRoomName);
    socket.on('newRoomAlreadyExists', function() {
      alert(newRoomName + ' already exists!');
    });
    socket.on('newRoomOk', function() {
      var roomList = document.getElementById('chatroom-list');
      var newRoomLink = document.createElement('a');
      newRoomLink.setAttribute('href', '/'+newRoomName);
      newRoomLink.setAttribute('class', 'roomName');
      newRoomLink.textContent = newRoomName;
      roomList.appendChild(newRoomLink);
      $('#new-room-form').toggleClass('hidden');
    });
  }
});

$('#cancel-new-room').click(function() {
  $('#new-room-input').val('');
  $('#new-room-form').toggleClass('hidden');
  $('#add-new-room').toggleClass('hidden');
});