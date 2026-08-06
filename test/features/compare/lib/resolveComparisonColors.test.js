import { resolveComparisonColors } from 'src/features/compare/lib/resolveComparisonColors.js';
import { POKEMON_TYPE_COLORS } from 'src/shared/styles/pokemonTypes.js';

const FALLBACK = '#2563eb';

const pokemonOfType = (type) => ({ types: [type] });

describe('resolveComparisonColors', () => {
  it('colors each pokemon by its primary type when they differ', () => {
    const colors = resolveComparisonColors(pokemonOfType('grass'), pokemonOfType('fire'), FALLBACK);

    expect(colors).toEqual({ colorA: POKEMON_TYPE_COLORS.grass, colorB: POKEMON_TYPE_COLORS.fire });
  });

  it('falls the second color back to the fallback when both share primary type', () => {
    const colors = resolveComparisonColors(pokemonOfType('fire'), pokemonOfType('fire'), FALLBACK);

    expect(colors).toEqual({ colorA: POKEMON_TYPE_COLORS.fire, colorB: FALLBACK });
  });
});
