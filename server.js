var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));
app.set('port', (process.env.PORT || 80));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

mongo.connect('mongodb://127.0.0.1/27017', function(err, db) {
  if(err) throw err;

  io.on('connection', function(socket) {

    var col = db.collection('messages');
    var sendStatus = function(str) {
      socket.emit('status', str);
    };

    // Emit all messages
    col.find().limit(100).sort({_id: 1}).toArray(function(error, result) {
      if(error) throw error;
      socket.emit('output', result);
    });

    //Wait for input
    socket.on('input', function(data) {
      var name = data.name;
      var message = data.message;
      var whiteSpace = /^\s*$/;

      if (whiteSpace.test(name) || whiteSpace.test(message)) {
        sendStatus('Name and message is required.');
      } else {
        col.insert({name: name, message: message}, function() {
          // Emit latest message to ALL clients
          io.emit('output', [data]);

          sendStatus({
            message: "Message sent",
            clear: true
          });
        });
      }
    });
  });
});

io.on('connection', function(socket) {
  console.log('Someone has connected!');
});

http.listen(app.get('port'), function() {
  console.log('Node app is running at localhost: ' + app.get('port') + '!');
});
