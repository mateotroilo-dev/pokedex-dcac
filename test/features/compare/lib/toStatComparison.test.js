import { toStatComparison } from 'src/features/compare/lib/toStatComparison.js';

const BASE_STATS = {
  hp: 45,
  attack: 49,
  defense: 49,
  'special-attack': 65,
  'special-defense': 65,
  speed: 45,
};

const buildPokemon = (overrides = {}) => ({
  stats: Object.entries({ ...BASE_STATS, ...overrides }).map(([name, value]) => ({
    name,
    value,
  })),
});

describe('toStatComparison', () => {
  it('marks pokemon A as the winner of a stat where it has the higher value', () => {
    const pokemonA = buildPokemon({ hp: 100 });
    const pokemonB = buildPokemon();

    const [hpRow] = toStatComparison(pokemonA, pokemonB);

    expect(hpRow).toEqual({ name: 'hp', label: 'PS', valueA: 100, valueB: 45, winner: 'a' });
  });

  it('marks pokemon B as the winner of a stat where it has the higher value', () => {
    const pokemonA = buildPokemon();
    const pokemonB = buildPokemon({ attack: 120 });

    const [, attackRow] = toStatComparison(pokemonA, pokemonB);

    expect(attackRow).toEqual({
      name: 'attack',
      label: 'Ataque',
      valueA: 49,
      valueB: 120,
      winner: 'b',
    });
  });

  it('marks a stat as a tie when both pokemon have the same value', () => {
    const pokemonA = buildPokemon();
    const pokemonB = buildPokemon();

    const rows = toStatComparison(pokemonA, pokemonB);
    const speedRow = rows.find((row) => row.name === 'speed');

    expect(speedRow.winner).toBeNull();
  });

  it('appends the total as the last row, with its own winner resolved the same way', () => {
    const pokemonA = buildPokemon({ hp: 100 });
    const pokemonB = buildPokemon();

    const rows = toStatComparison(pokemonA, pokemonB);
    const totalRow = rows.at(-1);

    expect(totalRow).toEqual({
      name: 'total',
      label: 'Total',
      valueA: 373,
      valueB: 318,
      winner: 'a',
    });
  });
});
