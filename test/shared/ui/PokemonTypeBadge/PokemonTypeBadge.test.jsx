import { screen } from '@testing-library/react';
import PokemonTypeBadge from 'src/shared/ui/PokemonTypeBadge/PokemonTypeBadge.jsx';
import { POKEMON_TYPE_COLORS } from 'src/shared/styles/pokemonTypes.js';
import { theme } from 'src/shared/styles/theme.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const WCAG_AA_CONTRAST = 4.5;

// jsdom devuelve los colores computados como `rgb(r, g, b)`, no como el hex que declara el styled.
const toChannels = (cssColor) => cssColor.match(/\d+/g).map(Number);

const toRelativeLuminance = (cssColor) =>
  toChannels(cssColor)
    .map((channel) => {
      const ratio = channel / 255;
      return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
    })
    .reduce((total, channel, index) => total + [0.2126, 0.7152, 0.0722][index] * channel, 0);

const toContrastRatio = (element) => {
  const { color, backgroundColor } = getComputedStyle(element);
  const [text, background] = [color, backgroundColor].map(toRelativeLuminance);

  return (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05);
};

describe('PokemonTypeBadge', () => {
  it('paints each type with its own color', () => {
    renderWithProviders(<PokemonTypeBadge type="fire" />);

    expect(screen.getByText('fire')).toHaveStyle({
      backgroundColor: POKEMON_TYPE_COLORS.fire,
    });
  });

  it('falls back to a neutral color for a type it does not know', () => {
    renderWithProviders(<PokemonTypeBadge type="cosmic" />);

    const badge = screen.getByText('cosmic');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({ backgroundColor: theme.colors.border });
  });

  it.each(Object.keys(POKEMON_TYPE_COLORS))('reaches AA contrast on %s', (type) => {
    renderWithProviders(<PokemonTypeBadge type={type} />);

    expect(toContrastRatio(screen.getByText(type))).toBeGreaterThanOrEqual(WCAG_AA_CONTRAST);
  });
});
