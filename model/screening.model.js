//////////////////////////
// Made by Thimo Koolen //
//////////////////////////

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScreeningSchema = new Schema({
	date: {
		type: String,
		required: true
	},
	starttime: {
		type: String,
		required: true
	},
	endtime: {
		type: String,
		required: true
	},
	theaterId: {
		type: Schema.Types.ObjectId,
		ref: 'theater',
		required: true
	},
	movieId: {
		type: Schema.Types.ObjectId,
		ref: 'movie',
		required: true
	}
}, {
	timestamps: true
});

const Screening = mongoose.model('screening', ScreeningSchema);

module.exports = Screening;