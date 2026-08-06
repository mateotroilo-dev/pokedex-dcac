import { filterPokemonIndex } from 'src/features/pokemon-list/lib/filterPokemonIndex.js';

const index = [
  { id: 1, name: 'bulbasaur' },
  { id: 25, name: 'pikachu' },
  { id: 26, name: 'raichu' },
  { id: 3, name: 'pokemon-3' },
  { id: 13, name: 'pokemon-13' },
];

describe('filterPokemonIndex', () => {
  it('matches names by substring', () => {
    expect(filterPokemonIndex(index, 'chu')).toEqual([
      { id: 25, name: 'pikachu' },
      { id: 26, name: 'raichu' },
    ]);
  });

  it('is case-insensitive', () => {
    expect(filterPokemonIndex(index, 'PIKA')).toEqual([{ id: 25, name: 'pikachu' }]);
  });

  it('matches an exact id when the term is only digits', () => {
    expect(filterPokemonIndex(index, '25')).toEqual([{ id: 25, name: 'pikachu' }]);
  });

  it('ignores leading zeros when the term is only digits', () => {
    expect(filterPokemonIndex(index, '0025')).toEqual([{ id: 25, name: 'pikachu' }]);
  });

  it('does not match a digits-only term against the name', () => {
    // 'pokemon-13' tambien contiene '3', pero un termino de solo digitos compara contra el id.
    expect(filterPokemonIndex(index, '3')).toEqual([{ id: 3, name: 'pokemon-3' }]);
  });

  it('returns the full index for an empty term', () => {
    expect(filterPokemonIndex(index, '')).toEqual(index);
  });

  it('returns the full index for an undefined term', () => {
    expect(filterPokemonIndex(index, undefined)).toEqual(index);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterPokemonIndex(index, 'zzz')).toEqual([]);
  });
});
