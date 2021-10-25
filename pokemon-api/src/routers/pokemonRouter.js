const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const errorHandler = require('../middleware/errorHandler');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
module.exports = router;

//router to get pokemon by id
router.get('/get/:id', async (request, response) => {
	const { id } = request.params;
	const pokemonObject = await getPokemon(id);
	if (!pokemonObject) {
		errorHandler(404, response);
	} else {
		response.send(pokemonToRespond(pokemonObject));
	}
});

//router to get pokemon by name
router.get('/query', async (request, response) => {
	const query = request.query.name;
	const pokemon = await getPokemon(query);

	if (pokemon) {
		let pokemonObject = pokemonToRespond(pokemon);
		response.send(pokemonObject);
	} else {
		errorHandler(404, response);
	}
});

//router to catch a pokemon
router.put('/catch/:id', async (request, response) => {
	const username = request.username;
	const id = request.params.id;

	if (hasCaughtPokemon(username, id)) {
		errorHandler(403, response);
	} else {
		try {
			await catchPokemon(username, id);
			response.send(`User cought this wild pokemon!`);
		} catch {
			errorHandler(500, response);
		}
	}
});

//router to release a pokemon
router.delete(`/release/:id`, (request, response) => {
	const username = request.username;
	const id = request.params.id;
	if (hasCaughtPokemon(username, id)) {
		try {
			releasePokemon(username, id);
			response.send(`User released this pokemon`);
		} catch {
			errorHandler(500, response);
		}
	} else {
		errorHandler(403, response);
	}
});

//router to return a list of a use pokemon list
router.get('/', async (request, response) => {
	const username = request.username;

	try {
		response.send(await getUserPokemonList(username));
	} catch {
		errorHandler(401, response);
	}
});

//get pokemon data
async function getPokemon(id) {
	try {
		return await P.getPokemonByName(id).then((response) => {
			return response;
		});
	} catch (error) {
		return false;
	}
}

//create a shorter pokemon data to send
function pokemonToRespond(pokemon) {
	return {
		name: pokemon.name,
		height: pokemon.height,
		weight: pokemon.weight,
		types: pokemon.types,
		front_pic: pokemon.sprites.front_default,
		back_pic: pokemon.sprites.back_default,
		abilities: pokemon.abilities,
	};
}

//check if user has caught the same pokemon before
function hasCaughtPokemon(username, id) {
	const userPokemons = fs.readdirSync(`./pokemon-api/users/${username}`);
	for (const pokemon of userPokemons) {
		if (path.parse(`${pokemon}`).name == id) {
			return true;
		}
	}
	return false;
}

//catches a pokemon and put it in the user directory
async function catchPokemon(username, id) {
	const pokemon = pokemonToRespond(await getPokemon(id));
	await fs.writeFile(
		`./pokemon-api/users/${username}/${id}.json`,
		JSON.stringify(pokemon),
		(error) => {
			if (error) {
				return error;
			}
		}
	);
}

//remove pokemon file from his directory
async function releasePokemon(username, id) {
	await fs.unlink(`./pokemon-api/users/${username}/${id}.json`, (error) => {
		if (error) {
			return error;
		}
	});
}

//get all the user pokemon
async function getUserPokemonList(username) {
	const list = [];
	const userPokemons = fs.readdirSync(`./pokemon-api/users/${username}`);
	for (const pokemon of userPokemons) {
		const pokemonInfo = fs.readFileSync(`./pokemon-api/users/${username}/${pokemon}`);
		list.push(JSON.parse(pokemonInfo));
	}
	return list;
}
