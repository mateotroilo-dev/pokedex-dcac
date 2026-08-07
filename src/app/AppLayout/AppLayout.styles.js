import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const StatusGroup = styled.div`
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const HeaderNavLink = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  font-weight: 600;

  &.active {
    text-decoration: underline;
  }
`;
