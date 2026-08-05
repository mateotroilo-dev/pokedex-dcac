import Card from 'src/shared/ui/Card/Card.jsx';
import ProgressiveImage from 'src/shared/ui/ProgressiveImage/ProgressiveImage.jsx';
import { formatPokemonNumber } from 'src/shared/lib/formatPokemonNumber.js';
import PokemonTypeBadge from 'src/features/pokemon-list/components/PokemonTypeBadge/PokemonTypeBadge.jsx';
import {
  POKEMON_CARD_MIN_HEIGHT,
  POKEMON_CARD_SPRITE_SIZE,
} from 'src/features/pokemon-list/constants.js';
import {
  DexNumber,
  Name,
  Types,
} from 'src/features/pokemon-list/components/PokemonCard/PokemonCard.styles.js';

const PokemonCard = ({ pokemon }) => (
  <Card minHeight={POKEMON_CARD_MIN_HEIGHT}>
    <ProgressiveImage
      src={pokemon.sprites.front}
      alt={pokemon.name}
      width={POKEMON_CARD_SPRITE_SIZE}
      height={POKEMON_CARD_SPRITE_SIZE}
    />
    <DexNumber>{formatPokemonNumber(pokemon.id)}</DexNumber>
    <Name>{pokemon.name}</Name>
    <Types>
      {pokemon.types.map((type) => (
        <PokemonTypeBadge key={type} type={type} />
      ))}
    </Types>
  </Card>
);

export default PokemonCard;
