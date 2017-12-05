var express = require('express');
var routes = express.Router();
var mongodb = require('../../config/mongo.db');
var Screening = require('../../model/screening.model');

routes.get('/screenings', function (req, res) {
	Screening.find({})
		.then((screenings) => {
			res.status(200).json(screenings);
		})
		.catch((error) => res.status(400).json(error));
});

routes.get('/screenings/:id', function (req, res) {
	const id = req.params.id;
	
	Screening.find({_id: id})
		.then((screening) => {
			res.status(200).json(screening);
		})
		.catch((error) => res.status(400).json(error));
});

routes.post('/screenings', function (req, res) {
	const body = req.body;
	
	Screening.create(body)
		.then((screening) => res.status(200).json(screening))
		.catch((error) => res.status(400).json(error));
});

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