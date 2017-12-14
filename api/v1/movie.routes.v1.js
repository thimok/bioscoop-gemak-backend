//////////////////////////
// Made by Thimo Koolen //
//////////////////////////

var express = require('express');
var routes = express.Router();
var mongodb = require('../../config/mongo.db');
var neo4j = require('../../config/neo4j.db');
var Movie = require('../../model/movie.model');

routes.get('/movies', function (req, res) {
	Movie.find({})
		.populate('screenings')
		.then((movies) => {
			res.status(200).json(movies);
		})
		.catch((error) => res.status(400).json(error));
});

routes.get('/movies/:id', function (req, res) {
	const id = req.params.id;
	
	Movie.find({'_id': id})
		.populate('screenings')
		.then((movie) => {
			res.status(200).json(movie);
		})
		.catch((error) => res.status(400).json(error));
});

routes.get('/movies/:id/actors', function (req, res) {
	const id = req.params.id;
	
	neo4j.session
		.run("MATCH (a:Actor)-[:ACTS_IN]->(m:Movie{mongoId: {idParam}}) RETURN a", {idParam: id})
		.then((result) => {
			var actorArr = [];
			var movieName = '';
			
			result.records.forEach((record) => {
				actorArr.push({
					name: record._fields[0].properties.name
				});
			});
			
			Movie.find({'_id': id})
				.then((movie) => {
					movieName = movie[0].name;
					
					const response = {
						movieName: movieName,
						actors: actorArr
					};
					
					neo4j.close();
					res.status(200).json(response);
				});
		});
});

routes.post('/movies', function (req, res) {
	const body = req.body;
	
	delete body._id; //Remove the empty ID that gets inserted by Angular as this generates a BadRequest response.
	
	Movie.create(body)
		.then((movie) => {
			const movieId = movie._id + '';
			neo4j.session
				.run("CREATE (movie:Movie{name: {nameParam}, mongoId: {idParam}}) RETURN movie", {
					nameParam: body.name,
					idParam: movieId
				})
				.then(() => {
					neo4j.close();
					res.status(200).json(movie)
				})
				.catch((error) => res.status(400).json(error.message));
		})
		.catch((error) => res.status(400).json(error));
});

routes.post('/movies/:id/actors', function (req, res) {
	const id = req.params.id;
	const body = req.body;
	
	const name = body.name;
	
	neo4j.session
		.run("MERGE (a:Actor{name: {nameParam}}) RETURN a", {nameParam: name})
		.then(() => {
			neo4j.session
				.run("MATCH (a:Actor{name: {nameParam}}), (m:Movie{mongoId: {idParam}}) CREATE UNIQUE (a)-[:ACTS_IN]->(m) RETURN a, m", {
					nameParam: name,
					idParam: id
				})
				.then((result) => {
					neo4j.close();
					res.status(200).json(result);
				})
				.catch((error) => res.status(400).json(error));
		})
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
				// neo4j.session
				// 	.run("MATCH (n:Actor) OPTIONAL MATCH (n)-[r]-(m:Movie{mongoId: {idParam}}) DELETE r, n, m", {
				// 		idParam: id
				// 	})
				// 	.then((result) => {
				// 		neo4j.close();
				// 		res.status(200).json(movie);
				// 	});
				
				neo4j.session
					.run("MATCH (m:Movie{mongoId: {idParam}}) DETACH DELETE m", {
						idParam: id
					})
					.then((result) => {
						neo4j.close();
						res.status(200).json(movie);
					});
			}
		})
		.catch((error) => res.status(400).json(error));
});

module.exports = routes;