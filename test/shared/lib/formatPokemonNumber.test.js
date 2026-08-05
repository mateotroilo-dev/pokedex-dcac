import { formatPokemonNumber } from 'src/shared/lib/formatPokemonNumber.js';

describe('formatPokemonNumber', () => {
  it('pads a single digit up to four', () => {
    expect(formatPokemonNumber(1)).toBe('#0001');
  });

  it('keeps the width of every id in the national dex', () => {
    expect(formatPokemonNumber(25)).toBe('#0025');
    expect(formatPokemonNumber(151)).toBe('#0151');
    expect(formatPokemonNumber(1025)).toBe('#1025');
  });

  it('does not truncate an id wider than the padding', () => {
    expect(formatPokemonNumber(10001)).toBe('#10001');
  });
});
