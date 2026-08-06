import { TOTAL_LABEL } from 'src/shared/lib/constants/stats.js';
import {
  Row,
  Value,
} from 'src/features/pokemon-detail/components/PokemonStatTotal/PokemonStatTotal.styles.js';

const PokemonStatTotal = ({ value }) => (
  <Row>
    <span>{TOTAL_LABEL}</span>
    <Value>{value}</Value>
  </Row>
);

export default PokemonStatTotal;
