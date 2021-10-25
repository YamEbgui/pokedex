module.exports = errorHandler;

function errorHandler(error, response) {
	switch (error) {
		case 404:
			response.status(404);
			response.send('No such pokemon, try another name');
			break;

		case 403:
			response.status(403);
			response.send(
				`User tried to release an uncaught pokemon, or catching an already caught pokemon `
			);
			break;

		case 500:
			response.status(500);
			response.send('Server error, please try again later');
			break;

		case 401:
			response.status(401);
			response.send('Unauthenticated user request');
			break;
	}
}
