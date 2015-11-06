'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var mongo = require('mongodb');
var mongoURI = process.env.MONGOURI || 'mongodb://127.0.0.1/chat';

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/build'));

var chatroomRoutes = express.Router();
require('./routes/router.js')(chatroomRoutes);
app.use('/api', chatroomRoutes);


// Client routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/:room', function(req, res) {
  mongo.connect(mongoURI, function(err, db) {
    db.collection('rooms').find({name: req.params.room}).toArray(function(error, result) {
      if (result.length) {
        res.render('chatroom', {roomName: req.params.room});
      } else {
        res.send('Error 404 - page not found.');
      }
    });
  });
});

app.get('/*', function(req, res) {
  res.send('Error 404 - page not found.');
});

// Init database connection
var myDB;
mongo.connect(mongoURI, function(err, db) {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully connected to MongoDB.....\n');
  }
  myDB = db;
});

// Socket definitions
var online = 0;
io.on('connection', function(socket) {
  online++;
  console.log('Socket connected! ' + online + ' online!\n');

  socket.on('validateNewRoom', function(newRoomName) {
    myDB.collection('rooms').find({name: newRoomName}).toArray(function(error, result) {
      if (result.length) {
        socket.emit('newRoomAlreadyExists');
      } else {
        myDB.collection('rooms').insert({name: newRoomName});
        socket.emit('newRoomOk')
      }
    });
  });

  socket.on('newMessage', function(newMessage, roomName) {
    var whiteSpace = /^\s*$/;
    if (whiteSpace.test(newMessage.name) || whiteSpace.test(newMessage.message)) {
      socket.emit('status', {msg: 'Name and message is required.'});
    } else {
      myDB.collection(roomName).insert(newMessage, function() {
        //emit latest message to ALL clients (client decides to render or not)
        io.emit('newMessageToRender', newMessage, roomName);
        socket.emit('status', {message: "Message sent", clear: true});
      });
    }
  });

  socket.on('indexLoad', function() {
    io.emit('numOnline', online);
  });
  
  socket.on('disconnect', function () {
    online--;
    console.log('User disconnected! ' + online + ' online!\n');
    io.emit('numOnline', online);
  });
});


http.listen(port, function() {
  console.log('\nServer is running on port ' + port + '.....\n');
});
