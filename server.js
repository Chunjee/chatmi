var express = require('express');
var jade = require('jade');
var io = require('socket.io').listen(app);
var app = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layour:false});
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response) {
  res.render('home.jade');
});

io.sockets.on('connection', function(socket) {
  //our other events...
});

socket.on('setPseudo', function(data) {
  socket.set('pseudo', data);
});

socket.on('message', function(message) {
  socket.get('pseudo', function(error, name) {
  	var data = {'message':message, pseudo:name};
  	socket.broadcast.emit('message', data);
  	console.log("user " + name + " send this: " + message);
  })
});


app.listen(5000);