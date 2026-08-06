import PokemonTypeBadge from 'src/shared/ui/PokemonTypeBadge/PokemonTypeBadge.jsx';
import { formatPokemonNumber } from 'src/shared/lib/formatPokemonNumber.js';
import {
  DexNumber,
  Name,
  Types,
  Wrapper,
} from 'src/features/pokemon-detail/components/PokemonSummary/PokemonSummary.styles.js';

const PokemonSummary = ({ pokemon }) => (
  <Wrapper>
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
