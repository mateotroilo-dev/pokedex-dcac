import { formatHeight } from 'src/features/pokemon-detail/lib/formatHeight.js';
import { formatWeight } from 'src/features/pokemon-detail/lib/formatWeight.js';
import {
  ABILITIES_LABEL,
  HEIGHT_LABEL,
  WEIGHT_LABEL,
} from 'src/features/pokemon-detail/components/PokemonFacts/PokemonFacts.constants.js';
import {
  AbilityItem,
  AbilityList,
  Detail,
  List,
  Term,
} from 'src/features/pokemon-detail/components/PokemonFacts/PokemonFacts.styles.js';

const PokemonFacts = ({ pokemon }) => (
  <List>
    <Term>{HEIGHT_LABEL}</Term>
    <Detail>{formatHeight(pokemon.height)}</Detail>
    <Term>{WEIGHT_LABEL}</Term>
    <Detail>{formatWeight(pokemon.weight)}</Detail>
    <Term>{ABILITIES_LABEL}</Term>
    <Detail>
      <AbilityList>
        {pokemon.abilities.map((ability) => (
          <AbilityItem key={ability}>{ability}</AbilityItem>
        ))}
      </AbilityList>
    </Detail>
  </List>
);

export default PokemonFacts;
