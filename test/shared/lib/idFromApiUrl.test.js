import { idFromApiUrl } from 'src/shared/lib/idFromApiUrl.js';

describe('idFromApiUrl', () => {
  it('takes the trailing numeric segment out of a PokeAPI url', () => {
    expect(idFromApiUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('works without a trailing slash', () => {
    expect(idFromApiUrl('https://pokeapi.co/api/v2/pokemon-species/25')).toBe(25);
  });
});
