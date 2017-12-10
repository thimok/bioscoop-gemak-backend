var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var Theater = require('../model/theater.model');

chai.use(chaiHttp);

describe('Theater Domain Test', () => {
	let theater1, theater2;
	
	let theaterToAdd = {
		name: "Theater 3",
		capacity: 100
	};
	
	let theaterToEdit = {
		name: "Theater 1 Edited",
		capacity: 105
	};
	
	beforeEach((done) => {
		theater1 = new Theater({
			_id: "5a2d4b7ef44e1e3d1cef468d",
			name: "Theater 1",
			capacity: 100
		});
		
		theater2 = new Theater({
			_id: "5a2d4b7ef44e1e3d1cef468e",
			name: "Theater 2",
			capacity: 85
		});
		
		Promise.all([theater1.save(), theater2.save()])
			.then(() => done());
	});
	
	it('GET /api/v1/theaters should return a list of theaters', (done) => {
		chai.request(server)
			.get('/api/v1/theaters')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('array');
				res.body.should.have.lengthOf(2);
				
				done();
			});
	});
	
	it('GET /api/v1/theaters/:id should return one specific theater with that ID', (done) => {
		chai.request(server)
			.get('/api/v1/theaters/5a2d4b7ef44e1e3d1cef468d')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('array');
				res.body.should.have.lengthOf(1);
				
				//Item specific test
				res.body[0].name.should.be.equal('Theater 1');
				res.body[0].capacity.should.be.equal(100);
				
				done();
			});
	});
	
	it('POST /api/v1/theaters should add a Theater and return the object in JSON format', (done) => {
		chai.request(server)
			.post('/api/v1/theaters')
			.send(theaterToAdd)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				
				//Item specific test
				res.body.name.should.be.equal('Theater 3');
				res.body.capacity.should.be.equal(100);
				
				done();
			});
	});
	
	it('PUT /api/v1/theaters/:id should update a Movie and return the updated object in JSON format', (done) => {
		chai.request(server)
			.put('/api/v1/theaters/5a2d4b7ef44e1e3d1cef468d')
			.send(theaterToEdit)
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.an('object');
				
				//Item specific test
				res.body.name.should.be.equal('Theater 1 Edited');
				res.body.capacity.should.be.equal(105);
				
				done();
			});
	});
	
	it('DELETE /api/v1/theaters/:id should delete a Theater and return the object in JSON format', (done) => {
		chai.request(server)
			.delete('/api/v1/theaters/5a2d4b7ef44e1e3d1cef468e')
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.an('object');
				
				//Item specific test
				res.body.name.should.be.equal('Theater 2');
				res.body.capacity.should.be.equal(85);
				
				done();
			});
	});
});