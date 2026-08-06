import styled from 'styled-components';

export const List = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
`;

export const Term = styled.dt`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const Detail = styled.dd`
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const AbilityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const AbilityItem = styled.li`
  text-transform: capitalize;
`;
