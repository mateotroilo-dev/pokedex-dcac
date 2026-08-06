import ImageGallery from 'src/shared/ui/ImageGallery/ImageGallery.jsx';
import { POKEMON_SPRITE_GALLERY_MAIN_SIZE } from 'src/features/pokemon-detail/constants.js';
import { SPRITE_LABELS } from 'src/features/pokemon-detail/components/PokemonSpriteGallery/PokemonSpriteGallery.constants.js';

// PokeAPI deja en null los sprites que no tiene esa entrada. Medido el 2026-08-05: las 1025
// especies base tienen los cuatro, pero las formas alternas no —12 de 257, y 8 de esas los tienen
// los cuatro en null (koraidon-limited-build y companía)—, y a esas se llega por URL directa.
// Sin filtrar, cada null queda como una miniatura clickeable que solo muestra el fallback.
const toImages = (sprites) =>
  Object.entries(SPRITE_LABELS)
    .map(([key, label]) => ({ src: sprites[key], label }))
    .filter(({ src }) => Boolean(src));

const PokemonSpriteGallery = ({ pokemon }) => (
  <ImageGallery
    images={toImages(pokemon.sprites)}
    width={POKEMON_SPRITE_GALLERY_MAIN_SIZE}
    height={POKEMON_SPRITE_GALLERY_MAIN_SIZE}
  />
);

export default PokemonSpriteGallery;
