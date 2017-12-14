//////////////////////////
// Made by Thimo Koolen //
//////////////////////////

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var Movie = require('../model/movie.model');
var Theater = require('../model/theater.model');
var Screening = require('../model/screening.model');

chai.use(chaiHttp);

describe('Screening Domain Test', () => {
	let movie1;
	let theater1;
	let screening1, screening2;
	
	let screeningToAdd = {
		date: "2017-12-16",
		starttime: "12:00",
		endtime: "14:15",
		theaterId: "5a2d4b7ef44e1e3d1cef468d",
		movieId: "5a2d4166e03ac13ea48ac2e6"
	};
	
	let screeningToEdit = {
		date: "2017-12-15",
		starttime: "12:05",
		endtime: "14:20",
		theaterId: "5a2d4b7ef44e1e3d1cef468d",
		movieId: "5a2d4166e03ac13ea48ac2e6"
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
		
		theater1 = new Theater({
			_id: "5a2d4b7ef44e1e3d1cef468d",
			name: "Theater 1",
			capacity: 100
		});
		
		screening1 = new Screening({
			_id: "5a2d52d9a284944abc490f22",
			date: "2017-12-15",
			starttime: "12:00",
			endtime: "14:15",
			theaterId: "5a2d4b7ef44e1e3d1cef468d",
			movieId: "5a2d4166e03ac13ea48ac2e6"
		});
		
		screening2 = new Screening({
			_id: "5a2d52d9a284944abc490f21",
			date: "2017-12-15",
			starttime: "14:45",
			endtime: "17:00",
			theaterId: "5a2d4b7ef44e1e3d1cef468d",
			movieId: "5a2d4166e03ac13ea48ac2e6"
		});
		
		Promise.all([movie1.save(), theater1.save(), screening1.save(), screening2.save()])
			.then(() => done());
	});
	
	it('GET /api/v1/screenings should return a list of screenings', (done) => {
		chai.request(server)
			.get('/api/v1/screenings')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('array');
				res.body.should.have.lengthOf(2);
				
				done();
			});
	});
	
	it('GET /api/v1/screenings/:id should return one specific screening with that ID', (done) => {
		chai.request(server)
			.get('/api/v1/screenings/5a2d52d9a284944abc490f22')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('array');
				res.body.should.have.lengthOf(1);
				
				//Item specific test
				res.body[0].date.should.be.equal('2017-12-15');
				res.body[0].starttime.should.be.equal('12:00');
				res.body[0].endtime.should.be.equal('14:15');
				
				done();
			});
	});
	
	it('POST /api/v1/screenings should add a Screening and return the object in JSON format', (done) => {
		chai.request(server)
			.post('/api/v1/screenings')
			.send(screeningToAdd)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				
				//Item specific test
				res.body.date.should.be.equal('2017-12-16');
				res.body.starttime.should.be.equal('12:00');
				res.body.endtime.should.be.equal('14:15');
				
				done();
			});
	});
	
	it('PUT /api/v1/screenings/:id should update a Screening and return the updated object in JSON format', (done) => {
		chai.request(server)
			.put('/api/v1/screenings/5a2d52d9a284944abc490f22')
			.send(screeningToEdit)
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.an('object');
				
				//Item specific test
				res.body.date.should.be.equal('2017-12-15');
				res.body.starttime.should.be.equal('12:05');
				res.body.endtime.should.be.equal('14:20');
				
				done();
			});
	});
	
	it('DELETE /api/v1/screenings/:id should delete a Screening and return the object in JSON format', (done) => {
		chai.request(server)
			.delete('/api/v1/screenings/5a2d52d9a284944abc490f21')
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.an('object');
				
				//Item specific test
				res.body.date.should.be.equal('2017-12-15');
				res.body.starttime.should.be.equal('14:45');
				res.body.endtime.should.be.equal('17:00');
				
				done();
			});
	});
});