import styled from 'styled-components';

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: ${({ theme }) => theme.breakpoints.lg};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;
