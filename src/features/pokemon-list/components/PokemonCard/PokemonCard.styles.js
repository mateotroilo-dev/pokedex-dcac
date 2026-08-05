import styled from 'styled-components';

export const DexNumber = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-variant-numeric: tabular-nums;
`;

export const Name = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-transform: capitalize;
`;

export const Types = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: center;
`;
