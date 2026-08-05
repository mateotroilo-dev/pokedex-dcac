import styled from 'styled-components';
import { pickReadableTextColor } from 'src/shared/lib/pickReadableTextColor.js';

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

export const RetryButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) =>
    pickReadableTextColor(theme.colors.accent, [theme.colors.text, theme.colors.textInverted])};
  font-weight: 600;
  cursor: pointer;
`;
