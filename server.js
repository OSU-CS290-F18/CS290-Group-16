var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;

var mongoURL = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDBName;

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res, next) {
  var incompleteTasks = mongoDB.collection('incomplete');
  incompleteTasks.find({}).toArray(function(err, incompleteDoc) {
    if (err) {
      res.status(500).send("Error communicating with the DB");
    }
    var completedTasks = mongoDB.collection('complete');
    completedTasks.find({}).toArray(function(err, completeDoc) {
      if (err) {
        res.status(500).send("Error communicating with the DB");
      }
      res.status(200).render('accordion', {
        incompleteTasks: incompleteDoc,
        completedTasks: completeDoc
      });
    });
  });
});

app.post('/insertTask', function (req, res, next) {
  if (req.body && req.body.description) {
    var incompleteTasks = mongoDB.collection('incomplete');
    incompleteTasks.insertOne(
      { description: req.body.description },
      function (err, result) {
        if (err) {
          res.status(500).send("Error adding task to DB");
        }
        else {
          res.status(200).send("Success");
        }
      }
    );
  }
});

app.post('/removeTask', function (req, res, next) {
  if (req.body && req.body.collection && req.body.description) {
    var taskCollection = mongoDB.collection(req.body.collection);
    taskCollection.deleteOne(
      { description: req.body.description },
      function (err, result) {
        if (err) {
          res.status(500).send("Error removing task from DB");
        }
        else {
          res.status(200).send("Success");
        }
      }
    );
  }
});

app.post('/moveTask', function (req, res, next) {
  if (req.body && req.body.source && req.body.destination && req.body.description) {
    var sourceCollection = mongoDB.collection(req.body.source);
    var destCollection = mongoDB.collection(req.body.destination);
    sourceCollection.deleteOne(
      { description: req.body.description },
      function (err, result) {
        if (err) {
          res.status(500).send("Error removing task from DB");
        }
      }
    );
    destCollection.insertOne(
      { description: req.body.description },
      function (err, result) {
        if (err) {
          res.status(500).send("Error adding task to DB");
        }
      }
    );
    res.status(200).send("Success");
  }
});

app.get('*', function (req, res, next) {
  res.status(404).render('404');
});

MongoClient.connect(mongoURL, function(err, client) {
  if (err) {
    throw err;
  }
  mongoDB = client.db(mongoDBName);
  app.listen(port, function () {
    console.log("== Server listening on port", port);
  });
});
