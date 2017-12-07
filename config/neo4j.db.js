const neo4j = require('neo4j-driver').v1;
const config = require('./env/env');


var driver = neo4j.driver(config.neo4jurl, neo4j.auth.basic(config.neo4juser, config.neo4jpassword));
var session = driver.session();

function close() {
	session.close();
}

module.exports = {
	'session': session,
	'close': close
};