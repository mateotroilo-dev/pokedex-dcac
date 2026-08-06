import { screen } from '@testing-library/react';
import PokemonStatComparison from 'src/features/compare/components/PokemonStatComparison/PokemonStatComparison.jsx';
import { Fill } from 'src/shared/ui/ProgressBar/ProgressBar.styles.js';
import { theme } from 'src/shared/styles/theme.js';
import { toPokemon } from 'src/shared/lib/toPokemon.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const bulbasaur = toPokemon(pokemonDetailResponse);
const ivysaur = toPokemon({ ...pokemonDetailResponse, id: 2, name: 'ivysaur' });

describe('PokemonStatComparison', () => {
  it('announces the stat column and one column per pokemon', () => {
    renderWithProviders(<PokemonStatComparison pokemonA={bulbasaur} pokemonB={ivysaur} />);

    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(screen.getByRole('columnheader', { name: 'bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'ivysaur' })).toBeInTheDocument();
  });

  it('renders a row per stat plus the total, each announced by its label', () => {
    renderWithProviders(<PokemonStatComparison pokemonA={bulbasaur} pokemonB={ivysaur} />);

    ['PS', 'Ataque', 'Defensa', 'At. Esp.', 'Def. Esp.', 'Velocidad', 'Total'].forEach((label) => {
      expect(screen.getByRole('rowheader', { name: label })).toBeInTheDocument();
    });
  });

  it('falls the second column of bars back to the theme accent when both share primary type', () => {
    const { container } = renderWithProviders(
      <PokemonStatComparison pokemonA={bulbasaur} pokemonB={ivysaur} />,
    );

    const fills = container.querySelectorAll(Fill.toString());
    const [firstRowFillA, firstRowFillB] = fills;
    expect(firstRowFillA).not.toHaveStyle({ backgroundColor: theme.colors.accentSecondary });
    expect(firstRowFillB).toHaveStyle({ backgroundColor: theme.colors.accentSecondary });
  });
});
