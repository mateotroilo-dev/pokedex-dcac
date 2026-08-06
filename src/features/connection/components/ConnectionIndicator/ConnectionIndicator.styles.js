import styled from 'styled-components';

// min-width cubre "Sin conexión" (el texto mas largo de los dos estados): sin esto, alternar
// entre "En línea" y "Sin conexión" corre el resto del header a cada cambio.
export const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 7em;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background-color: ${({ theme, $online }) =>
    $online ? theme.colors.accentSecondary : theme.colors.accent};
`;
