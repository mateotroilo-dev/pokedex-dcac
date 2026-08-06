import ProgressBar from 'src/shared/ui/ProgressBar/ProgressBar.jsx';
import VisuallyHidden from 'src/shared/ui/VisuallyHidden/VisuallyHidden.jsx';
import { MAX_BASE_STAT } from 'src/shared/lib/constants/stats.js';
import {
  TIE_ANNOUNCEMENT,
  WINNER_ANNOUNCEMENT,
} from 'src/features/compare/components/PokemonStatComparisonRow/PokemonStatComparisonRow.constants.js';
import {
  Cell,
  StatHeader,
  StatValue,
  ValueNumber,
} from 'src/features/compare/components/PokemonStatComparisonRow/PokemonStatComparisonRow.styles.js';

const PokemonStatComparisonRow = ({ row, colorA, colorB }) => {
  const isTie = row.winner === null;

  return (
    <tr>
      <StatHeader scope="row">{row.label}</StatHeader>
      <Cell>
        <StatValue $isWinner={row.winner === 'a'} $numberFirst>
          <ValueNumber $numberFirst>{row.valueA}</ValueNumber>
          <ProgressBar value={row.valueA} max={MAX_BASE_STAT} color={colorA} />
        </StatValue>
        {row.winner === 'a' && <VisuallyHidden>{WINNER_ANNOUNCEMENT}</VisuallyHidden>}
        {isTie && <VisuallyHidden>{TIE_ANNOUNCEMENT}</VisuallyHidden>}
      </Cell>
      <Cell>
        <StatValue $isWinner={row.winner === 'b'}>
          <ProgressBar value={row.valueB} max={MAX_BASE_STAT} color={colorB} />
          <ValueNumber>{row.valueB}</ValueNumber>
        </StatValue>
        {row.winner === 'b' && <VisuallyHidden>{WINNER_ANNOUNCEMENT}</VisuallyHidden>}
        {isTie && <VisuallyHidden>{TIE_ANNOUNCEMENT}</VisuallyHidden>}
      </Cell>
    </tr>
  );
};

export default PokemonStatComparisonRow;
