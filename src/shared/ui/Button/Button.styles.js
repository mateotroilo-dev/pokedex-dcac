import styled, { css } from 'styled-components';
import { pickReadableTextColor } from 'src/shared/lib/pickReadableTextColor.js';

const VARIANT_STYLES = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) =>
      pickReadableTextColor(theme.colors.accent, [theme.colors.text, theme.colors.textInverted])};
  `,
};

export const StyledButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;

  ${({ $variant }) => VARIANT_STYLES[$variant]}
`;
