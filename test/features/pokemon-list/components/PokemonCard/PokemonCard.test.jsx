import { screen } from '@testing-library/react';
import PokemonCard from 'src/features/pokemon-list/components/PokemonCard/PokemonCard.jsx';
import { toPokemon } from 'src/shared/lib/toPokemon.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

// Bulbasaur: id 1, dos tipos. Sale del mismo fixture que mockea MSW, ya pasado por el transformer.
const bulbasaur = toPokemon(pokemonDetailResponse);

describe('PokemonCard', () => {
  it('shows the dex number padded to four digits', () => {
    renderWithProviders(<PokemonCard pokemon={bulbasaur} />);

    expect(screen.getByText('#0001')).toBeInTheDocument();
  });

  it('shows the name', () => {
    renderWithProviders(<PokemonCard pokemon={bulbasaur} />);

    expect(screen.getByRole('heading', { name: 'bulbasaur' })).toBeInTheDocument();
  });

  it('shows the front sprite, not the artwork', () => {
    // El sprite es alt="": el nombre ya lo aporta el heading, adentro del mismo link. Sin nombre
    // accesible, el rol pasa a "presentation" y no se puede buscar por getByRole('img').
    const { container } = renderWithProviders(<PokemonCard pokemon={bulbasaur} />);

    expect(container.querySelector('img')).toHaveAttribute('src', bulbasaur.sprites.front);
  });

  it('renders one badge per type', () => {
    renderWithProviders(<PokemonCard pokemon={bulbasaur} />);

    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
  });

  it('links the whole card to the pokemon detail page', () => {
    renderWithProviders(<PokemonCard pokemon={bulbasaur} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/1');
  });
});
