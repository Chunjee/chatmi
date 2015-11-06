'use strict';

var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoURI = process.env.MONGOURI || 'mongodb://127.0.0.1/chat';

module.exports = function(router) {
  router.use(bodyParser.json());

  router.get('/home', function(req, res) {
    mongo.connect(mongoURI, function(err, db) {
      db.collection('rooms').find().toArray(function(error, result) {
        res.send(result);
      });
    });
  });

  router.get('/:room', function(req, res) {
    var roomName = req.params.room;
    mongo.connect(mongoURI, function(err, db) {
      db.collection(roomName).find().toArray(function(error, result) {
        res.send(result);
      });
    });
  });

  router.get('/*', function(req, res) {
    res.send('Error 404: Page not found.');
  });
}