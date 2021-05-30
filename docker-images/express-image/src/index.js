var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send(generateStudents());
});


app.listen(3000, function() {
	console.log('Accepting HTTP requests on port 3000.');
});

function generateStudents() {
var nbCity = chance.integer({
      min: 0,
      max: 10
    });
    console.log(nbCity);
    var city = [];
    for (var i = 0; i < nbCity; i++) {
    city.push(chance.city());
    };
  console.log(city);
  return city;
}


