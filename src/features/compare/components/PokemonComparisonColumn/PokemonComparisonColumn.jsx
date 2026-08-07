import PokemonTypeBadge from 'src/shared/ui/PokemonTypeBadge/PokemonTypeBadge.jsx';
import ProgressiveImage from 'src/shared/ui/ProgressiveImage/ProgressiveImage.jsx';
import { formatPokemonNumber } from 'src/shared/lib/formatPokemonNumber.js';
import { POKEMON_COMPARISON_SPRITE_SIZE } from 'src/features/compare/constants.js';
import {
  DexNumber,
  Name,
  Types,
  Wrapper,
} from 'src/features/compare/components/PokemonComparisonColumn/PokemonComparisonColumn.styles.js';

const PokemonComparisonColumn = ({ pokemon }) => (
  <Wrapper>
    <ProgressiveImage
      // Ilustracion oficial, no el sprite: acá hay a lo sumo 2 cards a la vez, asi que el peso
      // extra frente al sprite no se nota como en la grilla del dex (ver el mismo comentario en
      // PokemonCard.jsx).
      src={pokemon.sprites.artwork}
      alt=""
      width={POKEMON_COMPARISON_SPRITE_SIZE}
      height={POKEMON_COMPARISON_SPRITE_SIZE}
    />
    <DexNumber>{formatPokemonNumber(pokemon.id)}</DexNumber>
    <Name>{pokemon.name}</Name>
    <Types>
      {pokemon.types.map((type) => (
        <PokemonTypeBadge key={type} type={type} />
      ))}
    </Types>
  </Wrapper>
);

export default PokemonComparisonColumn;
