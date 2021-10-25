const errorHandler = require('./errorHandler');
const fs = require('fs');

function userHandler(request, response, next) {
	const username = request.headers.username;
	if (doesUserExist(username)) {
		request.username = username;
		next();
	} else {
		fs.mkdir(`./pokemon-api/users/${username}`, (error) => {
			if (error) {
				errorHandler(500, response);
			}
		});
		next();
	}
}

function doesUserExist(username) {
	const usersList = fs.readdirSync(`./pokemon-api/users`);
	for (const user of usersList) {
		if (username == user) {
			return true;
		}
	}
	return false;
}

(module.exports = userHandler), doesUserExist;
