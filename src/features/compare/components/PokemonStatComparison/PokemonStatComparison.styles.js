import styled from 'styled-components';
import { STAT_LABEL_COLUMN_WIDTH } from 'src/features/compare/constants.js';

// table-layout fixed + colgroup en vez de dejar que el contenido decida el ancho: son las mismas
// columnas que el grid de encabezados en PokemonComparison.styles.js, y ahi sí tienen que medir
// igual sea cual sea el contenido de cada fila.
export const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  colgroup col:first-child {
    width: ${STAT_LABEL_COLUMN_WIDTH};
  }
`;
