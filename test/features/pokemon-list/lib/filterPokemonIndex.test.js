import { filterPokemonIndex } from 'src/features/pokemon-list/lib/filterPokemonIndex.js';

const index = [
  { id: 1, name: 'bulbasaur' },
  { id: 25, name: 'pikachu' },
  { id: 26, name: 'raichu' },
  { id: 3, name: 'pokemon-3' },
  { id: 13, name: 'pokemon-13' },
];

describe('filterPokemonIndex', () => {
  describe('term', () => {
    it('matches names by substring', () => {
      expect(filterPokemonIndex(index, { term: 'chu' })).toEqual([
        { id: 25, name: 'pikachu' },
        { id: 26, name: 'raichu' },
      ]);
    });

    it('is case-insensitive', () => {
      expect(filterPokemonIndex(index, { term: 'PIKA' })).toEqual([{ id: 25, name: 'pikachu' }]);
    });

    it('matches an exact id when the term is only digits', () => {
      expect(filterPokemonIndex(index, { term: '25' })).toEqual([{ id: 25, name: 'pikachu' }]);
    });

    it('ignores leading zeros when the term is only digits', () => {
      expect(filterPokemonIndex(index, { term: '0025' })).toEqual([{ id: 25, name: 'pikachu' }]);
    });

    it('does not match a digits-only term against the name', () => {
      // 'pokemon-13' tambien contiene '3', pero un termino de solo digitos compara contra el id.
      expect(filterPokemonIndex(index, { term: '3' })).toEqual([{ id: 3, name: 'pokemon-3' }]);
    });

    it('returns an empty array when nothing matches', () => {
      expect(filterPokemonIndex(index, { term: 'zzz' })).toEqual([]);
    });
  });

  describe('typeIds', () => {
    it('matches entries whose id is in the set', () => {
      expect(filterPokemonIndex(index, { typeIds: [25, 26] })).toEqual([
        { id: 25, name: 'pikachu' },
        { id: 26, name: 'raichu' },
      ]);
    });

    it('an empty set filters down to nothing', () => {
      expect(filterPokemonIndex(index, { typeIds: [] })).toEqual([]);
    });

    it('null is not applicable and does not filter', () => {
      expect(filterPokemonIndex(index, { typeIds: null })).toEqual(index);
    });
  });

  describe('generationIds', () => {
    it('matches entries whose id is in the set', () => {
      expect(filterPokemonIndex(index, { generationIds: [1, 3] })).toEqual([
        { id: 1, name: 'bulbasaur' },
        { id: 3, name: 'pokemon-3' },
      ]);
    });

    it('an empty set filters down to nothing', () => {
      expect(filterPokemonIndex(index, { generationIds: [] })).toEqual([]);
    });

    it('null is not applicable and does not filter', () => {
      expect(filterPokemonIndex(index, { generationIds: null })).toEqual(index);
    });
  });

  it('combines the three criteria in AND', () => {
    expect(
      filterPokemonIndex(index, { term: 'chu', typeIds: [25, 26, 1], generationIds: [25] }),
    ).toEqual([{ id: 25, name: 'pikachu' }]);
  });

  it('keeps index order regardless of the order the ids come in', () => {
    expect(filterPokemonIndex(index, { typeIds: [26, 1, 25] })).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 25, name: 'pikachu' },
      { id: 26, name: 'raichu' },
    ]);
  });

  it('returns the full index for an empty term', () => {
    expect(filterPokemonIndex(index, { term: '' })).toEqual(index);
  });

  it('returns the full index for an undefined term', () => {
    expect(filterPokemonIndex(index, { term: undefined })).toEqual(index);
  });

  it('returns the full index when no criteria are given', () => {
    expect(filterPokemonIndex(index)).toEqual(index);
  });
});
