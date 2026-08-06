import styled from 'styled-components';

export const StatHeader = styled.th`
  text-align: left;
  font-weight: normal;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
`;

export const Cell = styled.td`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
`;

// La columna del primer pokemon pone el numero antes que la barra (en vez de despues, como la
// segunda): al reves, el numero cae pegado al limite entre las dos columnas y se confunde con la
// barra del otro pokemon en vez de con la propia.
export const StatValue = styled.div`
  display: grid;
  grid-template-columns: ${({ $numberFirst }) => ($numberFirst ? '2.5rem 1fr' : '1fr 2.5rem')};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ $isWinner }) => ($isWinner ? 'bold' : 'normal')};
`;

export const ValueNumber = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-variant-numeric: tabular-nums;
  text-align: ${({ $numberFirst }) => ($numberFirst ? 'left' : 'right')};
`;
