import { screen } from '@testing-library/react';
import PokemonStats from 'src/features/pokemon-detail/components/PokemonStats/PokemonStats.jsx';
import { toPokemon } from 'src/shared/lib/toPokemon.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const bulbasaur = toPokemon(pokemonDetailResponse);

describe('PokemonStats', () => {
  it('labels the six base stats in Spanish', () => {
    renderWithProviders(<PokemonStats pokemon={bulbasaur} />);

    ['PS', 'Ataque', 'Defensa', 'At. Esp.', 'Def. Esp.', 'Velocidad'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('shows the sum of the six stats as its own total', () => {
    renderWithProviders(<PokemonStats pokemon={bulbasaur} />);

    expect(screen.getByText('318')).toBeInTheDocument();
  });
});
