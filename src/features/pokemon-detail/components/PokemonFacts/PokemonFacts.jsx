import { formatAbilityName } from 'src/features/pokemon-detail/lib/formatAbilityName.js';
import { formatHeight } from 'src/features/pokemon-detail/lib/formatHeight.js';
import { formatWeight } from 'src/features/pokemon-detail/lib/formatWeight.js';
import {
  ABILITIES_LABEL,
  ABILITY_SEPARATOR,
  HEIGHT_LABEL,
  WEIGHT_LABEL,
} from 'src/features/pokemon-detail/components/PokemonFacts/PokemonFacts.constants.js';
import {
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
    <Detail>{pokemon.abilities.map(formatAbilityName).join(ABILITY_SEPARATOR)}</Detail>
  </List>
);

export default PokemonFacts;
