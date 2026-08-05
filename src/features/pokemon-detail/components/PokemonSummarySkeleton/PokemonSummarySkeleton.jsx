import Skeleton from 'src/shared/ui/Skeleton/Skeleton.jsx';
import { POKEMON_SUMMARY_ARTWORK_SIZE } from 'src/features/pokemon-detail/constants.js';
import {
  NAME_PLACEHOLDER,
  NUMBER_PLACEHOLDER,
  TYPES_PLACEHOLDER,
} from 'src/features/pokemon-detail/components/PokemonSummarySkeleton/PokemonSummarySkeleton.constants.js';
import { Wrapper } from 'src/features/pokemon-detail/components/PokemonSummarySkeleton/PokemonSummarySkeleton.styles.js';

const PokemonSummarySkeleton = () => (
  <Wrapper>
    <Skeleton width={POKEMON_SUMMARY_ARTWORK_SIZE} height={POKEMON_SUMMARY_ARTWORK_SIZE} />
    <Skeleton {...NUMBER_PLACEHOLDER} />
    <Skeleton {...NAME_PLACEHOLDER} />
    <Skeleton {...TYPES_PLACEHOLDER} />
  </Wrapper>
);

export default PokemonSummarySkeleton;
