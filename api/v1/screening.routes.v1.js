var express = require('express');
var routes = express.Router();
var mongodb = require('../../config/mongo.db');
var Screening = require('../../model/screening.model');

//GET /screenings
//OPTIONAL query parameters:
// - theaterId: all screenings from a specific theater
// - movieId: all screenings from a specific movie
// - date: all screenings on a specific date
// - starttime: all screenings on a specific start time
routes.get('/screenings', function (req, res) {
	const theaterId = req.query.theaterid || '';
	const movieId = req.query.movieid || '';
	const date = req.query.date || '';
	const starttime = req.query.starttime || '';
	
	var searchString = {};
	
	if (theaterId) {
		searchString.theaterId = theaterId;
	}
	
	if (movieId) {
		searchString.movieId = movieId;
	}
	
	if (date) {
		searchString.date = date;
	}
	
	if (starttime) {
		searchString.starttime = starttime;
	}
	
	Screening.find(searchString)
		.then((screenings) => {
			res.status(200).json(screenings);
		})
		.catch((error) => res.status(400).json(error));
});

//GET /screenings/:id
//REQUIRED parameters:
// - id: ID of the screening
routes.get('/screenings/:id', function (req, res) {
	const id = req.params.id;
	
	Screening.find({_id: id})
		.then((screening) => {
			res.status(200).json(screening);
		})
		.catch((error) => res.status(400).json(error));
});

//POST /screenings
//REQUIRED body parameters:
// - date: date on which the screening will take place
// - starttime: time in format "hhmm" the screening will commence
// - endtime: time in format "hhmm" the screening will finish
// - theaterId: ID of the theater this screening will take place in
// - movieId: ID of the movie shown in this screening
routes.post('/screenings', function (req, res) {
	const body = req.body;
	
	Screening.create(body)
		.then((screening) => res.status(200).json(screening))
		.catch((error) => res.status(400).json(error));
});

//PUT /screenings/:id
//OPTIONAL body parameters:
// - date: date on which the screening will take place
// - starttime: time in format "hhmm" the screening will commence
// - endtime: time in format "hhmm" the screening will finish
// - theaterId: ID of the theater this screening will take place in
// - movieId: ID of the movie shown in this screening
routes.put('/screenings/:id', function (req, res) {
	const id = req.params.id;
	const body = req.body;
	
	Screening.findByIdAndUpdate({_id: id}, body)
		.then(() => Screening.findById({_id: id}))
		.then((screening) => {
			if (screening == null || screening == 'null') {
				res.status(400).json({error: 'No objects updated'});
			} else {
				res.status(200).json(screening);
			}
		})
		.catch((error) => res.status(400).json(error));
});

//DELETE /screenings/:id
//REQUIRED paramaters:
// - id: ID of the screening to be deleted
routes.delete('/screenings/:id', function (req, res) {
	const id = req.params.id;
	
	Screening.findByIdAndRemove({_id: id})
		.then((screening) => {
			if (screening == null || screening == 'null') {
				res.status(400).json({error: 'No objects deleted'});
			} else {
				res.status(200).json(screening);
			}
		})
		.catch((error) => res.status(400).json(error));
});

module.exports = routes;