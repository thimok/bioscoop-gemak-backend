var express = require('express');
var routes = express.Router();
var mongodb = require('../../config/mongo.db');
var Movie = require('../../model/movie.model');

routes.get('/movies', function (req, res) {
	Movie.find({})
		.then((movies) => {
			res.status(200).json(movies);
		})
		.catch((error) => res.status(400).json(error));
});

routes.get('/movies/:id', function (req, res) {
	const id = req.params.id;
	
	Movie.find({'_id': id})
		.then((movie) => {
			res.status(200).json(movie);
		})
		.catch((error) => res.status(400).json(error));
});

routes.post('/movies', function (req, res) {
	const body = req.body;
	
	Movie.create(body)
		.then((movie) => res.status(200).json(movie))
		.catch((error) => res.status(400).json(error));
});

routes.put('/movies/:id', function (req, res) {
	const id = req.params.id;
	const body = req.body;
	
	Movie.findByIdAndUpdate({_id: id}, body)
		.then(() => Movie.findById({_id: id}))
		.then((movie) => {
			if (movie == null || movie == 'null') {
				res.status(400).json({error: 'No objects updated'});
			} else {
				res.status(200).send(movie);
			}
		})
		.catch((error) => res.status(400).json(error));
});

routes.delete('/movies/:id', function (req, res) {
	const id = req.params.id;
	
	Movie.findByIdAndRemove({_id: id})
		.then((movie) => {
			if (movie == null || movie == 'null') {
				res.status(400).json({error: 'No objects deleted'});
			} else {
				res.status(200).json(movie);
			}
		})
		.catch((error) => res.status(400).json(error));
});

module.exports = routes;