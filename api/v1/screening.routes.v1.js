//////////////////////////
// Made by Thimo Koolen //
//////////////////////////

var express = require('express');
var routes = express.Router();
var mongodb = require('../../config/mongo.db');
var Screening = require('../../model/screening.model');
var Movie = require('../../model/movie.model');
var Theater = require('../../model/theater.model');

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
	
	delete body._id;
	
	// Screening.create(body)
	// 	.then((screening) => res.status(200).json(screening))
	// 	.catch((error) => res.status(400).json(error));
	Screening.create(body)
		.then((screening) => {
			Movie.findOne({'_id': screening.movieId})
				.then((movie) => {
					movie.screenings.push(screening);
					movie.save();
				})
				.then(() => {
					Theater.findOne({'_id': screening.theaterId})
						.then((theater) => {
							theater.screenings.push(screening);
							theater.save();
						})
						.then(() => res.status(200).json(screening))
						.catch((error) => res.status(400).json(error.message));
				})
				.catch((error) => res.status(400).json(error.message));
		})
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
	
	Screening.findOne({_id: id})
		.then((screening) => {
			var oldMovie = screening.movieId;
			var currentMovie = body.movieId || screening.theaterId;
			
			var oldTheater = screening.theaterId;
			var currentTheater = body.theaterId || screening.theaterId;
			
			changeScreeningMovie(id, oldMovie, currentMovie)
				.then(() => changeScreeningTheater(id, oldTheater, currentTheater))
				.then(() => {
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
		});
});

function changeScreeningMovie(screeningId, oldMovieId, newMovieId) {
	return new Promise((resolve, reject) => {
		if (oldMovieId == newMovieId) {
			resolve();
		} else {
			Movie.findOne({_id: oldMovieId})
				.then((movie) => {
					var pos = movie.screenings.indexOf(screeningId);
					movie.screenings.splice(pos, 1);
					movie.save()
						.then(() => {
							Movie.findOne({_id: newMovieId})
								.then((movie) => {
									movie.screenings.push(screeningId);
									movie.save()
										.then(() => {
											resolve();
										});
								});
						});
				});
		}
	});
}

function changeScreeningTheater(screeningId, oldTheaterId, newTheaterId) {
	return new Promise((resolve, reject) => {
		if (oldTheaterId == newTheaterId) {
			resolve();
		} else {
			Theater.findOne({_id: oldTheaterId})
				.then((theater) => {
					var pos = theater.screenings.indexOf(screeningId);
					theater.screenings.splice(pos, 1);
					theater.save()
						.then(() => {
							Theater.findOne({_id: newTheaterId})
								.then((theater) => {
									theater.screenings.push(screeningId);
									theater.save()
										.then(() => {
											resolve();
										});
								});
						});
				});
		}
	});
}

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