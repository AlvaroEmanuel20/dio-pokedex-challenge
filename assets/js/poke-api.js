const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  return pokemon;
}

function convertPokeApiDetailToPokemonDetails(pokeDetails) {
  const pokemonDetails = new PokemonDetail();
  pokemonDetails.name = `${pokeDetails.name
    .charAt(0)
    .toUpperCase()}${pokeDetails.name.slice(1)}`;

  pokemonDetails.abilities = pokeDetails.abilities.map(
    (ability) => ability.ability.name
  );

  pokemonDetails.type = pokeDetails.types[0].type.name;

  pokemonDetails.height = `${pokeDetails.height * 10}cm`; //dm -> cm;
  pokemonDetails.weight = `${pokeDetails.weight / 10}kg`; //hg -> kg;

  pokemonDetails.stats = pokeDetails.stats;

  return pokemonDetails;
}

pokeApi.getPokemonDetails = (pokemonId) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemonDetails);
};

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);
};
