import styled from 'styled-components';

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: ${({ theme }) => theme.breakpoints.lg};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

export const EmptyMessage = styled.p`
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;
