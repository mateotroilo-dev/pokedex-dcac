import Skeleton from 'src/shared/ui/Skeleton/Skeleton.jsx';
import { IMAGE_GALLERY_THUMBNAIL_SIZE } from 'src/shared/ui/ImageGallery/ImageGallery.constants.js';
import { POKEMON_SPRITE_GALLERY_MAIN_SIZE } from 'src/features/pokemon-detail/constants.js';
import {
  ABILITY_PLACEHOLDER,
  ABILITY_PLACEHOLDER_COUNT,
  FACT_TERM_PLACEHOLDER,
  FACT_VALUE_PLACEHOLDER,
  NAME_PLACEHOLDER,
  NUMBER_PLACEHOLDER,
  STAT_BAR_PLACEHOLDER,
  STAT_LABEL_PLACEHOLDER,
  STAT_ROW_COUNT,
  STAT_TOTAL_LABEL_PLACEHOLDER,
  STAT_TOTAL_VALUE_PLACEHOLDER,
  STAT_VALUE_PLACEHOLDER,
  THUMBNAIL_PLACEHOLDER_COUNT,
  TYPES_PLACEHOLDER,
} from 'src/features/pokemon-detail/components/PokemonDetailSkeleton/PokemonDetailSkeleton.constants.js';
import {
  Abilities,
  Facts,
  Gallery,
  StatRow,
  StatRows,
  StatTotalRow,
  Stats,
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
    <Stats>
      <StatRows>
        {Array.from({ length: STAT_ROW_COUNT }, (_, position) => (
          <StatRow key={position}>
            <Skeleton {...STAT_LABEL_PLACEHOLDER} />
            <Skeleton {...STAT_BAR_PLACEHOLDER} />
            <Skeleton {...STAT_VALUE_PLACEHOLDER} />
          </StatRow>
        ))}
      </StatRows>
      <StatTotalRow>
        <Skeleton {...STAT_TOTAL_LABEL_PLACEHOLDER} />
        <Skeleton {...STAT_TOTAL_VALUE_PLACEHOLDER} />
      </StatTotalRow>
    </Stats>
    <Facts>
      <Skeleton {...FACT_TERM_PLACEHOLDER} />
      <Skeleton {...FACT_VALUE_PLACEHOLDER} />
      <Skeleton {...FACT_TERM_PLACEHOLDER} />
      <Skeleton {...FACT_VALUE_PLACEHOLDER} />
      <Skeleton {...FACT_TERM_PLACEHOLDER} />
      <Abilities>
        {Array.from({ length: ABILITY_PLACEHOLDER_COUNT }, (_, position) => (
          <Skeleton key={position} {...ABILITY_PLACEHOLDER} />
        ))}
      </Abilities>
    </Facts>
  </Wrapper>
);

export default PokemonDetailSkeleton;
