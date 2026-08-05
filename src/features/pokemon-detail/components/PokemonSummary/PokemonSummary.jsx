import PokemonTypeBadge from 'src/shared/ui/PokemonTypeBadge/PokemonTypeBadge.jsx';
import ProgressiveImage from 'src/shared/ui/ProgressiveImage/ProgressiveImage.jsx';
import { formatPokemonNumber } from 'src/shared/lib/formatPokemonNumber.js';
import { POKEMON_SUMMARY_ARTWORK_SIZE } from 'src/features/pokemon-detail/constants.js';
import {
  DexNumber,
  Name,
  Types,
  Wrapper,
} from 'src/features/pokemon-detail/components/PokemonSummary/PokemonSummary.styles.js';

const PokemonSummary = ({ pokemon }) => (
  <Wrapper>
    {/* No todas las entradas tienen artwork oficial; el sprite front si lo tiene siempre. */}
    <ProgressiveImage
      src={pokemon.sprites.artwork ?? pokemon.sprites.front}
      alt={pokemon.name}
      width={POKEMON_SUMMARY_ARTWORK_SIZE}
      height={POKEMON_SUMMARY_ARTWORK_SIZE}
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

export default PokemonSummary;
