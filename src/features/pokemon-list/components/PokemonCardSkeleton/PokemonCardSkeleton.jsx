import Card from 'src/shared/ui/Card/Card.jsx';
import Skeleton from 'src/shared/ui/Skeleton/Skeleton.jsx';
import {
  POKEMON_CARD_MIN_HEIGHT,
  POKEMON_CARD_SPRITE_SIZE,
} from 'src/features/pokemon-list/constants.js';
import {
  NAME_PLACEHOLDER,
  NUMBER_PLACEHOLDER,
  TYPES_PLACEHOLDER,
} from 'src/features/pokemon-list/components/PokemonCardSkeleton/PokemonCardSkeleton.constants.js';

const PokemonCardSkeleton = () => (
  <Card minHeight={POKEMON_CARD_MIN_HEIGHT}>
    <Skeleton width={POKEMON_CARD_SPRITE_SIZE} height={POKEMON_CARD_SPRITE_SIZE} />
    <Skeleton {...NUMBER_PLACEHOLDER} />
    <Skeleton {...NAME_PLACEHOLDER} />
    <Skeleton {...TYPES_PLACEHOLDER} />
  </Card>
);

export default PokemonCardSkeleton;
