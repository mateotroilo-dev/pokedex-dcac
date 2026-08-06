import styled from 'styled-components';
import { STAT_LABEL_COLUMN_WIDTH } from 'src/features/compare/constants.js';

// Mismas columnas que la tabla de PokemonStatComparison (gutter de label + dos columnas iguales),
// para que cada pokemon quede arriba de sus propias barras de stats en vez de centrarse aparte.
export const Columns = styled.div`
  display: grid;
  grid-template-columns: ${STAT_LABEL_COLUMN_WIDTH} 1fr 1fr;

  > *:nth-child(1) {
    grid-column: 2;
  }

  > *:nth-child(2) {
    grid-column: 3;
  }
`;
