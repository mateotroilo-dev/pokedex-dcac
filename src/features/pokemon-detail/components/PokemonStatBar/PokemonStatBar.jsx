import ProgressBar from 'src/shared/ui/ProgressBar/ProgressBar.jsx';
import {
  Label,
  Row,
  Value,
} from 'src/features/pokemon-detail/components/PokemonStatBar/PokemonStatBar.styles.js';

const PokemonStatBar = ({ label, value, max, color }) => (
  <Row>
    <Label>{label}</Label>
    <ProgressBar value={value} max={max} color={color} />
    <Value>{value}</Value>
  </Row>
);

export default PokemonStatBar;
