import styled from 'styled-components';

export const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background-color: ${({ theme, $online }) =>
    $online ? theme.colors.accentSecondary : theme.colors.accent};
`;
