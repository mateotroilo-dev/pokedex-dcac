import { screen } from '@testing-library/react';
import PokemonSpriteGallery from 'src/features/pokemon-detail/components/PokemonSpriteGallery/PokemonSpriteGallery.jsx';
import { SPRITE_LABELS } from 'src/features/pokemon-detail/components/PokemonSpriteGallery/PokemonSpriteGallery.constants.js';
import { toPokemon } from 'src/shared/lib/toPokemon.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

// Bulbasaur es de las entradas completas: tiene los cuatro sprites. Sale del mismo fixture que
// mockea MSW, ya pasado por el transformer.
const bulbasaur = toPokemon(pokemonDetailResponse);

describe('PokemonSpriteGallery', () => {
  it('opens on the official artwork, with one thumbnail per sprite', () => {
    renderWithProviders(<PokemonSpriteGallery pokemon={bulbasaur} />);

    expect(screen.getByRole('img', { name: SPRITE_LABELS.artwork })).toHaveAttribute(
      'src',
      bulbasaur.sprites.artwork,
    );
    expect(screen.getAllByRole('button')).toHaveLength(Object.keys(SPRITE_LABELS).length);
  });

  it('skips the sprites PokeAPI leaves null instead of giving them an empty thumbnail', () => {
    const withoutBack = { ...bulbasaur, sprites: { ...bulbasaur.sprites, back: null } };

    renderWithProviders(<PokemonSpriteGallery pokemon={withoutBack} />);

    expect(screen.queryByRole('button', { name: SPRITE_LABELS.back })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(Object.keys(SPRITE_LABELS).length - 1);
  });
});
