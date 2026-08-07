import styled, { css } from 'styled-components';
import { pickReadableTextColor } from 'src/shared/lib/pickReadableTextColor.js';

const VARIANT_STYLES = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) =>
      pickReadableTextColor(theme.colors.accent, [theme.colors.text, theme.colors.textInverted])};
  `,
};

const SIZE_STYLES = {
  md: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.fontSizes.md};
  `,
  sm: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
};

// $background pisa el color del $variant: lo usan quienes necesitan un color que no es de la
// paleta fija (ej. el color de tipo de un pokemon), calculando el texto legible igual que primary.
export const StyledButton = styled.button`
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;

  ${({ $variant }) => VARIANT_STYLES[$variant]}
  ${({ $size }) => SIZE_STYLES[$size]}

  ${({ $background, theme }) =>
    $background &&
    css`
      background-color: ${$background};
      color: ${pickReadableTextColor($background, [theme.colors.text, theme.colors.textInverted])};
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
