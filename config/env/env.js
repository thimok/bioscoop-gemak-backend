var env = {
	webPort: process.env.PORT || 3000,
	dbHost: process.env.DB_HOST || 'ds044787.mlab.com',
	dbPort: process.env.DB_PORT || '44787',
	dbUser: process.env.DB_USER || 'admin-mongo',
	dbPassword: process.env.DB_PASSWORD || '11vRwl8X9j12',
	dbDatabase: process.env.DB_DATABASE || 'bioscoop-gemak',
	neo4jHost: process.env.NEO4J_HOST || 'localhost',
	neo4jPort: process.env.NEO4J_PORT || '7687',
	neo4jUser: process.env.NEO4J_USER || 'neo4j',
	neo4jPassword: process.env.NEO4J_PASSWORD || '123456'
};


var dburl = process.env.NODE_ENV === 'production' ?
	'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
	'mongodb://localhost/' + env.dbDatabase;

var neo4jurl = process.env.NODE_ENV === 'production' ?
	'bolt://' + env.neo4jHost + ':' + env.neo4jPort :
	'bolt://localhost:7474';

module.exports = {
	env: env,
	dburl: dburl,
	neo4jurl: neo4jurl,
	neo4juser: env.neo4jUser,
	neo4jpassword: env.neo4jPassword
};