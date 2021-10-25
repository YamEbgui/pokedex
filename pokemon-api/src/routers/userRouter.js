const express = require('express');
const router = express.Router();
const fs = require('fs');
module.exports = router;

router.post('/', (request, response) => {
	const username = request.username;
	response.send(JSON.stringify({ username: username }));
});
