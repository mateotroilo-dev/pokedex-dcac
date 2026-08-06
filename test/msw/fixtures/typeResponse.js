export const typeResponse = {
  id: 12,
  name: 'grass',
  pokemon: [
    { slot: 1, pokemon: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' } },
    { slot: 1, pokemon: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' } },
    // Formas alternas: /type las devuelve, la interseccion contra el indice las tiene que descartar.
    {
      slot: 1,
      pokemon: { name: 'deoxys-attack', url: 'https://pokeapi.co/api/v2/pokemon/10001/' },
    },
  ],
};
