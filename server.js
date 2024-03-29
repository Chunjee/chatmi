'use strict';

var mongo = require('mongodb');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/build'));
var port = process.env.PORT || 3000;


mongo.connect('mongodb://127.0.0.1/chat', function(err, db) {
  err ? console.log(err) : console.log('Successfully connected to MongoDB.....\n');

  var online = 0;
  io.on('connection', function(socket) {
    online++;
    console.log('Socket connected! ' + online + ' online!\n');

    socket.on('homeLoad', function() {
      db.collection('rooms').find().toArray(function(err, res) {
        if(err) throw err;
        io.emit('returnRoomList', res);
        io.emit('numOnline', online);
      });
    });

    socket.on('saveNewRoomtoDB', function(newRoomName) {
      db.collection('rooms').insert({name: newRoomName});
    });

    socket.on('roomLoad', function(roomName) {
      var col = db.collection(roomName);

      var sendStatus = function(str) {
        socket.emit('status', str);
      };

      // Emit all messages
      col.find().limit(100).sort({_id: 1}).toArray(function(err, res) {
        if(err) throw err;
        socket.emit('output', res, roomName);
      });

      socket.on('input', function(newMessage) {
        var whiteSpace = /^\s*$/;

        if (whiteSpace.test(newMessage.name) || whiteSpace.test(newMessage.message)) {
          sendStatus('Name and message is required.');
        } else {
          col.insert(newMessage, function() {
            // Emit latest message to ALL clients
            io.emit('output', [newMessage], roomName);

            sendStatus({
              message: "Message sent",
              clear: true
            });
          });
        }
      });  //end input
    });  //end roomload
    socket.on('disconnect', function () {
      online--;
      console.log('User disconnected! ' + online + ' online!\n');
      io.emit('numOnline', online);
    });
  });  //end connection
}); //end mongo

http.listen(port, function() {
  console.log('\nServer is running on port ' + port + '.....\n');
});
