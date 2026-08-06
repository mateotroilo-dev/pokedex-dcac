import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

export const Message = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Illustration = styled.svg`
  width: calc(${({ theme }) => theme.spacing.xl} * 3);
  height: calc(${({ theme }) => theme.spacing.xl} * 3);
  color: ${({ theme }) => theme.colors.textMuted};
`;
