const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
	mongoose.connect('mongodb://locahost/bioscoop-gemak');
	mongoose.connection
		.once('open', () => {
			done();
		})
		.on('error', (error) => {
			console.warn('Warning', error);
		});
});

beforeEach((done) => {
	const {movies, theaters, screenings} = mongoose.connection.collections;
	movies.drop(() => {
		theaters.drop(() => {
			screenings.drop(() => {
				done();
			});
		});
	});
});