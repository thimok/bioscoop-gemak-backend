var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var Movie = require('../model/movie.model');

chai.use(chaiHttp);

describe('Movie Domain Test', () => {
	let movie1, movie2;
	
	let movieToAdd = {
		name: "Movie 3",
		description: "Movie 3 Description",
		release: "2017-12-03",
		genre: "action",
		imageUrl: "https://www.heyuguys.com/images/2017/03/Pirates-of-the-Caribbean-5-Movie-Poster.jpg"
	};
	
	let movieToEdit = {
		name: "Movie 1 Edited",
		description: "Movie 1 Description Edited",
		release: "2017-12-01",
		genre: "comedy",
		imageUrl: "https://www.google.nl/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
	};
	
	beforeEach((done) => {
		movie1 = new Movie({
			_id: '5a2d4166e03ac13ea48ac2e6',
			name: 'Movie 1',
			description: 'Movie 1 Description',
			release: '2017-12-01',
			genre: 'comedy',
			imageUrl: 'https://www.google.nl/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
		});
		
		movie2 = new Movie({
			_id: '5a2d4166e03ac13ea48ac2e7',
			name: 'Movie 2',
			description: 'Movie 2 Description',
			release: '2017-12-02',
			genre: 'adventure',
			imageUrl: 'https://bb.avans.nl/branding/_1_1/avans-WIT-logo-XTRAklein.png'
		});
		
		Promise.all([movie1.save(), movie2.save()])
			.then(() => done());
	});
	
	it('GET /api/v1/movies should return a list of movies', (done) => {
		chai.request(server)
			.get('/api/v1/movies')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('array');
				res.body.should.have.lengthOf(2);
				
				done();
			});
	});
	
	it('GET /api/v1/movies/:id should return one specific movie with that ID', (done) => {
		chai.request(server)
			.get('/api/v1/movies/5a2d4166e03ac13ea48ac2e6')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('array');
				res.body.should.have.lengthOf(1);
				
				//Item specific test
				res.body[0].name.should.be.equal('Movie 1');
				res.body[0].description.should.be.equal('Movie 1 Description');
				
				done();
			});
	});
	
	it('POST /api/v1/movies should add a Movie and return the object in JSON format', (done) => {
		chai.request(server)
			.post('/api/v1/movies')
			.send(movieToAdd)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				
				//Item specific test
				res.body.name.should.be.equal('Movie 3');
				res.body.description.should.be.equal('Movie 3 Description');
				
				done();
			});
	});
	
	it('PUT /api/v1/movies/:id should update a Movie and return the updated object in JSON format', (done) => {
		chai.request(server)
			.put('/api/v1/movies/5a2d4166e03ac13ea48ac2e6')
			.send(movieToEdit)
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.an('object');
				
				//Item specific test
				res.body.name.should.be.equal('Movie 1 Edited');
				res.body.description.should.be.equal('Movie 1 Description Edited');
				
				done();
			});
	});
	
	it('DELETE /api/v1/movies/:id should delete a Movie and return the object in JSON format', (done) => {
		chai.request(server)
			.delete('/api/v1/movies/5a2d4166e03ac13ea48ac2e7')
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.an('object');
				
				//Item specific test
				res.body.name.should.be.equal('Movie 2');
				res.body.description.should.be.equal('Movie 2 Description');
				
				done();
			});
	});
});