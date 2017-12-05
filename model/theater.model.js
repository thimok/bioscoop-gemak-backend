const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TheaterSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	capacity: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
});

const Theater = mongoose.model('theater', TheaterSchema);

module.exports = Theater;