export const createPokemonIndexResponse = (speciesCount) => ({
  count: speciesCount,
  next: null,
  previous: null,
  results: Array.from({ length: speciesCount }, (_, position) => ({
    name: `pokemon-${position + 1}`,
    url: `https://pokeapi.co/api/v2/pokemon/${position + 1}/`,
  })),
});
