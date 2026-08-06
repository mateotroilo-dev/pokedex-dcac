import { toPokemonIndex } from 'src/shared/lib/toPokemonIndex.js';
import { MAX_NATIONAL_DEX_ID } from 'src/shared/lib/constants/pokemon.js';
import { pokemonIndexResponse } from 'test/msw/fixtures/pokemonIndexResponse.js';

describe('toPokemonIndex', () => {
  it('takes the id out of the url and keeps the name', () => {
    expect(toPokemonIndex(pokemonIndexResponse.results)).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
      { id: 3, name: 'venusaur' },
      { id: 386, name: 'deoxys-normal' },
      { id: 1025, name: 'pecharunt' },
    ]);
  });

  it('drops the alternate forms, which are not national dex entries', () => {
    const names = toPokemonIndex(pokemonIndexResponse.results).map((entry) => entry.name);

    expect(names).not.toContain('deoxys-attack');
    expect(names).not.toContain('deoxys-defense');
  });

  it('keeps the last national dex entry', () => {
    const ids = toPokemonIndex(pokemonIndexResponse.results).map((entry) => entry.id);

    expect(ids).toContain(MAX_NATIONAL_DEX_ID);
  });
});
