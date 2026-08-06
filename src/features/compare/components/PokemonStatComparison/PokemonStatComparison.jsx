import { useTheme } from 'styled-components';
import { toStatComparison } from 'src/features/compare/lib/toStatComparison.js';
import { resolveComparisonColors } from 'src/features/compare/lib/resolveComparisonColors.js';
import VisuallyHidden from 'src/shared/ui/VisuallyHidden/VisuallyHidden.jsx';
import PokemonStatComparisonRow from 'src/features/compare/components/PokemonStatComparisonRow/PokemonStatComparisonRow.jsx';
import { STAT_COLUMN_LABEL } from 'src/features/compare/components/PokemonStatComparison/PokemonStatComparison.constants.js';
import { Table } from 'src/features/compare/components/PokemonStatComparison/PokemonStatComparison.styles.js';

const PokemonStatComparison = ({ pokemonA, pokemonB }) => {
  const theme = useTheme();
  const rows = toStatComparison(pokemonA, pokemonB);
  const { colorA, colorB } = resolveComparisonColors(
    pokemonA,
    pokemonB,
    theme.colors.accentSecondary,
  );

  return (
    <Table>
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">
            <VisuallyHidden>{STAT_COLUMN_LABEL}</VisuallyHidden>
          </th>
          <th scope="col">
            <VisuallyHidden>{pokemonA.name}</VisuallyHidden>
          </th>
          <th scope="col">
            <VisuallyHidden>{pokemonB.name}</VisuallyHidden>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <PokemonStatComparisonRow key={row.name} row={row} colorA={colorA} colorB={colorB} />
        ))}
      </tbody>
    </Table>
  );
};

export default PokemonStatComparison;
