import styled from 'styled-components';

export const EmptyMessage = styled.p`
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;
