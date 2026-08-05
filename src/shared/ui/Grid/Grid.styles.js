import styled from 'styled-components';

// Responsive sin breakpoints: auto-fill decide cuantas columnas entran. Los breakpoints del theme
// quedan para lo que no se resuelve solo.
export const Layout = styled.div`
  display: grid;
  grid-template-columns: ${({ $minItemWidth }) =>
    `repeat(auto-fill, minmax(${$minItemWidth}, 1fr))`};
  gap: ${({ theme }) => theme.spacing.md};
`;
