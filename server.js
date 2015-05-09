var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));
app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

mongo.connect('mongodb://127.0.0.1/chat', function(err, db) {
  if(err) throw err;

  io.on('connection', function(socket) {

var col = db.collection('messages');

    //Wait for input
    socket.on('input', function(data) {
      var name = data.name;
      var message = data.message;
      var whiteSpace = /^\s*$/;

      if (whiteSpace.test(name) || whiteSpace.test(message)) {
        console.log('Invalid');
      } else {
        col.insert({name: name, message: message}, function() {
          console.log('Inserted');
        });
      }
    });
  });
});











io.on('connection', function(socket) {
  console.log('Someone has connected!');
});


http.listen(app.get('port'), function() {
  console.log('Node app is running at localhost: ' + app.get('port'));
});

