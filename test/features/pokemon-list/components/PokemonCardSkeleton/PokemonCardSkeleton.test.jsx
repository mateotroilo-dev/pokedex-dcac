import PokemonCard from 'src/features/pokemon-list/components/PokemonCard/PokemonCard.jsx';
import PokemonCardSkeleton from 'src/features/pokemon-list/components/PokemonCardSkeleton/PokemonCardSkeleton.jsx';
import { toPokemon } from 'src/shared/lib/toPokemon.js';
import { pokemonDetailResponse } from 'test/msw/fixtures/pokemonDetailResponse.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const minHeightOf = (container) => getComputedStyle(container.firstChild).minHeight;

describe('PokemonCardSkeleton', () => {
  // El desajuste de tamaños no se ve en ningun assert de contenido: se ve como un salto de layout
  // el dia que la grilla cambia los skeletons por las cards.
  it('reserves the same height as the card it stands in for', () => {
    const skeleton = renderWithProviders(<PokemonCardSkeleton />);
    const card = renderWithProviders(<PokemonCard pokemon={toPokemon(pokemonDetailResponse)} />);

    expect(minHeightOf(skeleton.container)).toBe(minHeightOf(card.container));
    expect(minHeightOf(skeleton.container)).not.toBe('');
  });
});
