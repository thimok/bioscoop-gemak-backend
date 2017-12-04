var env = {
	webPort: process.env.PORT || 3000,
	dbHost: process.env.DB_HOST || 'ds044787.mlab.com',
	dbPort: process.env.DB_PORT || '44787',
	dbUser: process.env.DB_USER || 'admin-mongo',
	dbPassword: process.env.DB_PASSWORD || '11vRwl8X9j12',
	dbDatabase: process.env.DB_DATABASE || 'bioscoop-gemak'
};


var dburl = process.env.NODE_ENV === 'production' ?
	'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
	'mongodb://localhost/' + env.dbDatabase;

module.exports = {
	env: env,
	dburl: dburl
};