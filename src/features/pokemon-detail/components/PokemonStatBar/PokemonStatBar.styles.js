import styled from 'styled-components';

export const Row = styled.div`
  display: grid;
  grid-template-columns: 4.5rem 1fr 2.5rem;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Value = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-variant-numeric: tabular-nums;
  text-align: right;
`;
