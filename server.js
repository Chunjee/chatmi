'use strict';

var mongo = require('mongodb');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/build'));
app.set('port', (process.env.PORT || 3000));


mongo.connect('mongodb://127.0.0.1/chat', function(err, db) {
  if (err) {console.log(err);}
  else {console.log('Successfully connected to MongoDB.....\n')}


  io.on('connection', function(socket) {
    console.log('Socket connected!\n');

    socket.on('homeLoad', function() {
      db.collection('rooms').find().toArray(function(error, res) {
        io.emit('returnRoomList', res);
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
        socket.emit('output', res);
      });

      socket.on('input', function(newMessage) {
        var whiteSpace = /^\s*$/;

        if (whiteSpace.test(newMessage.name) || whiteSpace.test(newMessage.message)) {
          sendStatus('Name and message is required.');
        } else {
          col.insert(newMessage, function() {
            // Emit latest message to ALL clients
            io.emit('output', [newMessage]);

            sendStatus({
              message: "Message sent",
              clear: true
            });
          });
        }
      });  //end input

      socket.on('disconnect', function () {
        console.log('User disconnected!\n');
      });

    });  //end roomload
    socket.on('disconnect', function () {
      console.log('User disconnected!\n');
    });
  });  //end connection
}); //end mongo

http.listen(app.get('port'), function() {
  console.log('\nServer is running on port ' + app.get('port') + '.....\n');
});
