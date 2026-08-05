import { toPokemon } from 'src/shared/lib/toPokemon.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';

describe('toPokemon', () => {
  it('maps the raw detail to the shape the app stores', () => {
    expect(toPokemon(pokemonDetailResponse)).toEqual({
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      types: ['grass', 'poison'],
      stats: [
        { name: 'hp', value: 45 },
        { name: 'attack', value: 49 },
        { name: 'defense', value: 49 },
        { name: 'special-attack', value: 65 },
        { name: 'special-defense', value: 65 },
        { name: 'speed', value: 45 },
      ],
      abilities: ['overgrow', 'chlorophyll'],
      sprites: {
        front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        shiny:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
        back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
        artwork:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
    });
  });

  it('keeps only the keys the app uses', () => {
    expect(Object.keys(toPokemon(pokemonDetailResponse))).toEqual([
      'id',
      'name',
      'height',
      'weight',
      'types',
      'stats',
      'abilities',
      'sprites',
    ]);
  });

  it('drops moves, which are 268 KB of the 271 KB raw payload', () => {
    expect(toPokemon(pokemonDetailResponse)).not.toHaveProperty('moves');
  });

  it('leaves the artwork null when the sprite is missing', () => {
    const withoutArtwork = {
      ...pokemonDetailResponse,
      sprites: { ...pokemonDetailResponse.sprites, other: null },
    };

    expect(toPokemon(withoutArtwork).sprites.artwork).toBeNull();
  });
});
