const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	release: String,
	genre: String
}, {
	timestamps: true
});

const Movie = mongoose.model('movie', MovieSchema);

module.exports = Movie;