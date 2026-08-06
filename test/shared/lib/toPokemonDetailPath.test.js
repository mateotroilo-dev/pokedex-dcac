import { toPokemonDetailPath } from 'src/shared/lib/toPokemonDetailPath.js';

describe('toPokemonDetailPath', () => {
  it('builds the detail url for an id', () => {
    expect(toPokemonDetailPath(1)).toBe('/pokemon/1');
  });
});
