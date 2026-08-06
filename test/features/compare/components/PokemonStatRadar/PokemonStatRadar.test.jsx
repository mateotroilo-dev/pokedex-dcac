import PokemonStatRadar from 'src/features/compare/components/PokemonStatRadar/PokemonStatRadar.jsx';
import { Series } from 'src/shared/ui/RadarChart/RadarChart.styles.js';
import { POKEMON_TYPE_COLORS } from 'src/shared/styles/pokemonTypes.js';
import { theme } from 'src/shared/styles/theme.js';
import { toPokemon } from 'src/shared/lib/toPokemon.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const bulbasaur = toPokemon(pokemonDetailResponse);
const ivysaur = toPokemon({ ...pokemonDetailResponse, id: 2, name: 'ivysaur' });
const charmander = toPokemon({
  ...pokemonDetailResponse,
  id: 4,
  name: 'charmander',
  types: [{ slot: 1, type: { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' } }],
});

const findSeries = (container) => container.querySelectorAll(Series.toString());

describe('PokemonStatRadar', () => {
  it('colors each series by its primary type when they differ', () => {
    const { container } = renderWithProviders(
      <PokemonStatRadar pokemonA={bulbasaur} pokemonB={charmander} />,
    );

    const [seriesA, seriesB] = findSeries(container);
    expect(seriesA).toHaveStyle({ stroke: POKEMON_TYPE_COLORS.grass });
    expect(seriesB).toHaveStyle({ stroke: POKEMON_TYPE_COLORS.fire });
  });

  it('falls back the second series to the theme accent when both share primary type', () => {
    const { container } = renderWithProviders(
      <PokemonStatRadar pokemonA={bulbasaur} pokemonB={ivysaur} />,
    );

    const [seriesA, seriesB] = findSeries(container);
    expect(seriesA).toHaveStyle({ stroke: POKEMON_TYPE_COLORS.grass });
    expect(seriesB).toHaveStyle({ stroke: theme.colors.accentSecondary });
  });

  it('exposes a descriptive label naming both pokemon', () => {
    const { container } = renderWithProviders(
      <PokemonStatRadar pokemonA={bulbasaur} pokemonB={charmander} />,
    );

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-label',
      'Comparación de estadísticas entre bulbasaur y charmander',
    );
  });
});
