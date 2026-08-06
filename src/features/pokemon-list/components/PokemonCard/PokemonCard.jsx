import { Link } from 'react-router-dom';
import Card from 'src/shared/ui/Card/Card.jsx';
import PokemonTypeBadge from 'src/shared/ui/PokemonTypeBadge/PokemonTypeBadge.jsx';
import ProgressiveImage from 'src/shared/ui/ProgressiveImage/ProgressiveImage.jsx';
import { formatPokemonNumber } from 'src/shared/lib/formatPokemonNumber.js';
import { toPokemonDetailPath } from 'src/shared/lib/toPokemonDetailPath.js';
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
  <Card as={Link} to={toPokemonDetailPath(pokemon.id)} minHeight={POKEMON_CARD_MIN_HEIGHT}>
    <ProgressiveImage
      // El nombre del pokemon ya lo aporta el heading de abajo: con alt, el link entero se
      // llamaria "bulbasaur #0001 bulbasaur grass poison" para el lector de pantalla.
      src={pokemon.sprites.front}
      alt=""
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
