var express        = require('express');
var app            = express();
app.use(express.static(__dirname+'/public')); 

var bodyParser     = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lawData');
var db = mongoose.connection;

var port = process.env.PORT || 8080;
app.listen(port);

db.on('error', function (err) {
console.log('Server.js alerts of a connection error', err);
});
db.once('open', function () {
console.log('Rads Law Game is connected on port '+ port);
});

var Schema = mongoose.Schema;
var sceneSchema = new Schema({
//  id: {type: Number, unique: true},
  storynumber: Number,
  scenenumber: Number
//  title: String,
//  question: String,
//  answer1: {
//    response: String,
//    text: String,
//    next: Number
//  },
//  answer2: {
//    response: String,
//    text: String,
//    next: Number
//  },
//  authority: String,
//  video: Boolean,
//  resource: String,
//  thumbnail: String,
//  time: Number
});

var Scene = mongoose.model('Scene', sceneSchema);

//newScene.save(function(err, data){ //note that this uses the SCHEMA, not the MODEL
//  if (err) console.log(err);
//  else console.log('Saved ', data );
//});

//Scene.find(function(err, scenes){ //note that this uses the MODEL, not the SCHEMA
//    if (err) return console.error(err);
//    console.log(scenes)
//})
//
//var querycallback = function (err, data) {
//  if (err) { return console.error(err); }
//  else { 
//      console.log('Now I will try to query the database');
//      console.log(data); }
//    }
//
//var FindUpdatecallback = function (err, data) {
//  if (err) { return console.error(err); }
//  else { 
//      console.log('Now I will try to findoneandUpdate');
//      console.log(data); }
//    }
//// Get ONLY completed tasks
//Scene.find({id: 13 }, querycallback);
//Scene.findOneAndUpdate({id:13 }, {id:14}, FindUpdatecallback);

module.exports = Scene;

// routes ==================================================
//require('./app/routes')(app); // pass our application into our routes
    console.log('You have entered the routes export thingamabob')
    
    app.get('/scenes', function(req, res, next) {
      Scene.find(function(err, scenes){
        if(err) res.send(err);
        console.log('All scenes requested');
          res.json(scenes);
        });
    });

    app.post('/scenes', function(req, res, next) {
        console.log(req.body.newScene);
      var newScene = new Scene(req.body.newScene);
      newScene.save(function(err, scene){
        if(err) res.send(err);
          console.log('One new scene made');
        res.json(scene);
      });
    });

    app.get('/scenes/:id', function(req, res, next) {
      var id = req.params.id;
        Scene.findById(id, function (err, scene) {
        if(err) res.send(err);
          console.log('One scene requested');
        res.json(scene);
      });
    });

    app.put('/scenes/:id', function(req, res, next) {
        var scene = new Scene(req.body.story);
        var id = req.params.id;
        console.log(scene);
        Scene.findByIdAndUpdate(id, scene, function (err, scene) {
        if(err) res.send(err);
            console.log('One existing scene edited');
        res.json(scene);
      });
    });

    app.delete('/scenes/:id', function(req, res, next) {
        Scene.findByIdAndRemove(req.params.id, function (err, scene) {
            if(err) res.send(err);
            console.log('One scene deleted');
        Scene.find(function(err, scenes){
            if (err) res.send(err)
            console.log('The rest of the scenes have been returned')
            res.json(scenes)
        })
      });
    });


// start app ===============================================

exports = module.exports = app; 						// expose app