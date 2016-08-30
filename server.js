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
console.log('Server.js says alerts of a connection error', err);
});
db.once('open', function () {
console.log('Rads Law Game is connected on port '+ port);
});

var Schema = mongoose.Schema;
var sceneSchema = new Schema({
  id: {type: Number, unique: true},
  story: Number,
  number: Number,
  title: String,
  question: String,
  answer1: {
    response: String,
    text: String,
    next: Number
  },
  answer2: {
    response: String,
    text: String,
    next: Number
  },
  authority: String,
  video: Boolean,
  resource: String,
  thumbnail: String,
  time: Number
});

var Scene = mongoose.model('Scene', sceneSchema);

var newScene = new Scene({
  id: 13,
  story: 1,
  number: 1,
  title: 'Title 1',
  question: 'Is this question 1?',
  answer1: {
    response: 'a',
    text: 'Yes',
    next: null
  },
  answer2: {
    response: 'b',
    text: 'No',
    next: null
  },
  authority: 'Famous case 1',
  video: true,
  resource: '/asdf',
  thumbnail: '/zxcv',
  time: 60
});

newScene.save(function(err, data){ //note that this uses the SCHEMA, not the MODEL
  if (err) console.log(err);
  else console.log('Saved ', data );
});

Scene.find(function(err, scenes){ //note that this uses the MODEL, not the SCHEMA
    if (err) return console.error(err);
    console.log(scenes)
})

var querycallback = function (err, data) {
  if (err) { return console.error(err); }
  else { 
      console.log('Now I will try to query the database');
      console.log(data); }
    }

var FindUpdatecallback = function (err, data) {
  if (err) { return console.error(err); }
  else { 
      console.log('Now I will try to findoneandUpdate');
      console.log(data); }
    }
// Get ONLY completed tasks
Scene.find({id: 11 }, querycallback);
Scene.findOneAndUpdate({id:13 }, {id:14}, FindUpdatecallback);

module.exports = Scene;

// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)



// routes ==================================================
//require('./app/routes')(app); // pass our application into our routes
app.get('/editor/:story/:number', function(req,res){ //try http://localhost:8080/editor/1/2/
    var currentStory = req.param.story;
    var currentNumber = req.param.number;
    
    res.send(currentStory + ' ' + currentNumber);
})


// start app ===============================================

exports = module.exports = app; 						// expose app