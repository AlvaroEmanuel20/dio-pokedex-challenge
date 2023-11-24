const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
      <button onclick="loadPokemonDetails(${pokemon.number})">
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
      </button>
    `;
}

function convertPokemonDetailToCard(pokemonDetails) {
  return `
    <div class="pokemon-details">
      <h2 class="${pokemonDetails.type}-text">${
    pokemonDetails.name
  } details</h2>

      <ul>
        <li>
          Abilities: ${pokemonDetails.abilities.join(', ')}
        </li>
        <li>
          Weight: ${pokemonDetails.weight}
        </li>
        <li>
          Height: ${pokemonDetails.height}
        </li>
        <li>
          Stats:
          <ul>
            ${pokemonDetails.stats
              .map(
                (stat) =>
                  `
                <li>
                  ${stat.stat.name}: <span class="${pokemonDetails.type}-text">${stat.base_stat}</span>
                </li>
              `
              )
              .join('')}
          </ul>
        </li>
      </ul>
    </div>
  `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML += newHtml;
  });
}

function loadPokemonDetails(pokemonId) {
  pokeApi.getPokemonDetails(pokemonId).then((pokemonDetails) => {
    const newHtml = convertPokemonDetailToCard(pokemonDetails);
    document.getElementById('pokemonDetails').innerHTML = newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
