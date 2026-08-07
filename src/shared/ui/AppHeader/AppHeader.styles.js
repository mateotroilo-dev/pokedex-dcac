import styled from 'styled-components';

// Sin @media a proposito: en angosto los bloques ya no entran en una fila y el wrap los manda
// solos a una segunda, sin un breakpoint que mantener sincronizado con el contenido real.
export const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

export const Title = styled.h1`
  flex: 1 1 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};

  a {
    color: inherit;
    text-decoration: none;
  }
`;
