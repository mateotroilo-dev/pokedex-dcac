import styled, { css } from 'styled-components';

const VARIANT_STYLES = {
  default: css`
    background-color: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.border};
  `,
  warning: css`
    background-color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.textInverted};
  `,
};

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  ${({ $variant }) => VARIANT_STYLES[$variant]}
`;

export const Message = styled.p`
  flex: 1;
`;

export const DismissButton = styled.button`
  border: none;
  background: none;
  color: inherit;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1;
  cursor: pointer;
`;
