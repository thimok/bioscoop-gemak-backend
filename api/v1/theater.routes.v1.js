var express = require('express');
var routes = express.Router();
var mongodb = require('../../config/mongo.db');
var Theater = require('../../model/theater.model');

routes.get('/theaters', function (req, res) {
	Theater.find({})
		.populate('screenings')
		.then((theaters) => {
			res.status(200).json(theaters);
		})
		.catch((error) => res.status(400).json(error));
});

routes.get('/theaters/:id', function (req, res) {
	const id = req.params.id;
	
	Theater.find({_id: id})
		.populate('screenings')
		.then((theater) => {
			res.status(200).json(theater);
		})
		.catch((error) => res.status(400).json(error));
});

routes.post('/theaters', function (req, res) {
	const body = req.body;
	
	delete body._id;
	
	Theater.create(body)
		.then((theater) => res.status(200).json(theater))
		.catch((error) => res.status(400).json(error));
});

routes.put('/theaters/:id', function (req, res) {
	const id = req.params.id;
	const body = req.body;
	
	Theater.findByIdAndUpdate({_id: id}, body)
		.then(() => Theater.findById({_id: id}))
		.then((theater) => {
			if (theater == null || theater == 'null') {
				res.status(400).json({error: 'No objects updated'});
			} else {
				res.status(200).json(theater);
			}
		})
		.catch((error) => res.status(400).json(error));
});

routes.delete('/theaters/:id', function (req, res) {
	const id = req.params.id;
	
	Theater.findByIdAndRemove({_id: id})
		.then((theater) => {
			if (theater == null || theater == 'null') {
				res.status(400).json({error: 'No objects deleted'});
			} else {
				res.status(200).json(theater);
			}
		})
		.catch((error) => res.status(400).json(error));
});

module.exports = routes;