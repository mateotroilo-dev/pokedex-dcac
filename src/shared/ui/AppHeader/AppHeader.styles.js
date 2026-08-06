import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};

  a {
    color: inherit;
    text-decoration: none;
  }
`;
