const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: String,
	release: String,
	genre: String,
	imageUrl: String
}, {
	timestamps: true
});

const Movie = mongoose.model('movie', MovieSchema);

module.exports = Movie;