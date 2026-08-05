import styled from 'styled-components';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;
