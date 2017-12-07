var express = require('express');
var routes = express.Router();
var mongodb = require('../../config/mongo.db');
var neo4j = require('../../config/neo4j.db');
var Movie = require('../../model/movie.model');

routes.get('/movies', function (req, res) {
	Movie.find({})
		.then((movies) => {
			neo4j.session.run('MATCH (n) RETURN n')
				.then((result) => {
					var resArr = [];
					result.records.forEach(function (record) {
						resArr.push({
							name: record._fields[0].properties.name,
							mongoId: record._fields[0].properties.mongoId
						});
					});
					
					console.log('Result');
					console.log(resArr.json());
				});
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
	
	delete body._id; //Remove the empty ID that gets inserted by Angular as this generates a BadRequest response.
	
	Movie.create(body)
		.then((movie) => {
			const movieId = movie._id + '';
			neo4j.session
				.run("CREATE (movie:Movie{name: {nameParam}, mongoId: {idParam}}) RETURN movie", {nameParam: body.name, idParam: movieId})
				.then(() => {
					neo4j.close();
					res.status(200).json(movie)
				})
				.catch((error) => res.status(400).json(error.message));
		})
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