const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const pokemonRouter = require('./src/routers/pokemonRouter');
const userRouter = require('./src/routers/userRouter');
const errorHandler = require('./src/middleware/errorHandler');
const userHandler = require('./src/middleware/userHandler');

app.use(cors());
app.use(express.json());
app.use(userHandler);
app.use('/pokemon', pokemonRouter);
app.use('/info', userRouter);
app.use(errorHandler);

// start the server
app.listen(port, function () {
	console.log('app started');
});
