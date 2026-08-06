import Skeleton from 'src/shared/ui/Skeleton/Skeleton.jsx';
import { IMAGE_GALLERY_THUMBNAIL_SIZE } from 'src/shared/ui/ImageGallery/ImageGallery.constants.js';
import { POKEMON_SPRITE_GALLERY_MAIN_SIZE } from 'src/features/pokemon-detail/constants.js';
import {
  NAME_PLACEHOLDER,
  NUMBER_PLACEHOLDER,
  THUMBNAIL_PLACEHOLDER_COUNT,
  TYPES_PLACEHOLDER,
} from 'src/features/pokemon-detail/components/PokemonDetailSkeleton/PokemonDetailSkeleton.constants.js';
import {
  Gallery,
  Summary,
  Thumbnails,
  Wrapper,
} from 'src/features/pokemon-detail/components/PokemonDetailSkeleton/PokemonDetailSkeleton.styles.js';

const PokemonDetailSkeleton = () => (
  <Wrapper>
    <Gallery>
      <Skeleton
        width={POKEMON_SPRITE_GALLERY_MAIN_SIZE}
        height={POKEMON_SPRITE_GALLERY_MAIN_SIZE}
      />
      <Thumbnails>
        {Array.from({ length: THUMBNAIL_PLACEHOLDER_COUNT }, (_, position) => (
          <Skeleton
            key={position}
            width={IMAGE_GALLERY_THUMBNAIL_SIZE}
            height={IMAGE_GALLERY_THUMBNAIL_SIZE}
          />
        ))}
      </Thumbnails>
    </Gallery>
    <Summary>
      <Skeleton {...NUMBER_PLACEHOLDER} />
      <Skeleton {...NAME_PLACEHOLDER} />
      <Skeleton {...TYPES_PLACEHOLDER} />
    </Summary>
  </Wrapper>
);

export default PokemonDetailSkeleton;
