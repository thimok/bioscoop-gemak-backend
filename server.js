//////////////////////////
// Made by Thimo Koolen //
//////////////////////////

//Basic requires
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser')
var logger = require('morgan');
var mongodb = require('./config/mongo.db');
var config = require('./config/env/env');

//Route requires
var movie_routes_v1 = require('./api/v1/movie.routes.v1');
var screening_routes_v1 = require('./api/v1/screening.routes.v1');
var theater_routes_v1 = require('./api/v1/theater.routes.v1');

var app = express();

app.use(bodyParser.urlencoded({
	'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
	type: 'application/vnd.api+json'
}));

app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));

app.use(logger('dev'));

//CORS headers
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	
	if (req.method === 'OPTIONS') {
		res.status(200);
		res.end();
	} else {
		next();
	}
	
	//next();
});

//Routes init
app.use('/api/v1', movie_routes_v1);
app.use('/api/v1', screening_routes_v1);
app.use('/api/v1', theater_routes_v1);

//Fallback route if no other suitable route is found
app.use('*', function(req, res) {
	res.status(401);
	res.json({
		'error': 'API endpoint not found.'
	});
});

//Start server
app.listen(config.env.webPort, function() {
	console.log('Server started on port ' + config.env.webPort);
});

module.exports = app;